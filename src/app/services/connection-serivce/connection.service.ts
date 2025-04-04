import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {PeerService} from '../peer-service/peer-service.service';
import {Attack, AttackResponse, AttackResult, Game} from '@models/index';
import {Observable, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MessageType} from '@models/connection/message-types';
import {GameService} from '@services/game-service/game.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  username = signal<string>("");
  peerId = computed(() => this.peerService.peerId());
  isConnected = computed(() => this.peerService.isConnected());
  connectionError = computed(() => this.peerService.connectionError());
  connectedPeerId = computed(() => this.peerService.connectedPeerId());
  otherUsername = signal<string>('');

  private destroyRef = inject(DestroyRef);

  attackReceived = new Subject<Attack>();
  public onAttackReceived: Observable<Attack> = this.attackReceived.pipe(
    takeUntilDestroyed(this.destroyRef)
  );

  attackResultReceived = new Subject<AttackResponse>();
  public onAttackResultReceived: Observable<AttackResponse> = this.attackResultReceived.pipe(
    takeUntilDestroyed(this.destroyRef)
  );

  constructor(private peerService: PeerService, private gameService: GameService) {
    this.listenForMessages();
  }

  public connectToPeer(peerId: string) {
    this.peerService.connectTo(peerId);
  }

  public disconnect() {
    this.peerService.disconnect();
  }

  public sendAttack(attack: Attack): Promise<AttackResponse> {
    return new Promise<AttackResponse>((resolve) => {
      this.peerService.sendData({type: MessageType.Attack, attack});

      const subscription = this.peerService.onDataReceived$.subscribe((data) => {
        if (data.type === MessageType.AttackResponse) {
          resolve({attackResult: data.attackResult, attack: attack, destroyedShip:data.destroyedShip, destroyedShipPositions: data.destroyedShipCells});
          subscription.unsubscribe();
        }
      });
    });
  }

  public sendGame(game: Game) {
    this.peerService.sendData({type: MessageType.Game, game});
  }

  public sendUsername(): Promise<string> {
    let username = this.username();
    return new Promise<string>((resolve) => {
      this.peerService.sendData({type: MessageType.Username, username});

      const subscription = this.peerService.onDataReceived$.subscribe((data) => {
        if (data.type === MessageType.UsernameResponse) {
          resolve(data.username || 'Player');
          subscription.unsubscribe();
        }
      });
    });
  }

  private listenForMessages(): void {
    this.peerService.onDataReceived$.subscribe((data) => {
      switch (data.type) {
        case MessageType.Attack:
          console.log(`Incoming attack at (${data.attack.x}, ${data.attack.y})`);
          this.sendAttackResponse(data.attack);
          this.attackReceived.next(data.attack);
          break;

        case MessageType.AttackResponse:
          console.log('received attackResponse', data);
          this.attackResultReceived.next(data);
          break;

        case MessageType.GameOver:
          console.log('Game Over received');
          this.sendGameOverResponse();
          break;

        case MessageType.GameOverResponse:
          console.log('Game OverResponse received');
          break;

        case MessageType.Game:
          console.log('Game received: ' + data.game);
          this.sendGameResponse(data.game);
          break;

        case MessageType.GameResponse:
          console.log('Game Response received: ' + data.game);
          break;

        case MessageType.Username:
          console.log('Username received: ' + data.username);
          this.sendUsernameAnswer();
          this.otherUsername.set(data.username);
          break;

        case MessageType.UsernameResponse:
          console.log('Username Response received: ' + data.username);
          this.otherUsername.set(data.username);
          break;
      }
    });
  }

  private sendAttackResponse(attack: Attack): void {
    const ship = this.gameService.board.board.getValue()[attack.x][attack.y].content
    const attackResult = this.gameService.computeAttack(attack)
    const placedShipId = this.gameService.board.board.getValue()[attack.x][attack.y].placedShipId
    const destroyedShipCells = placedShipId !== null ? this.gameService.board.getAllPositionsOfPlaceId(placedShipId) : null;
    console.log(destroyedShipCells,placedShipId)
    this.peerService.sendData({
      type: MessageType.AttackResponse,
      attackResult: attackResult,
      attack: attack,
      destroyedShip: attackResult === AttackResult.Sunk ? ship : null,
      destroyedShipPositions: attackResult === AttackResult.Sunk && destroyedShipCells ? destroyedShipCells : null,
    });
  }

  private sendUsernameAnswer() {
    this.peerService.sendData({type: MessageType.UsernameResponse, username: this.username() || 'Player'});
  }

  private sendGameOverResponse() {
    this.peerService.sendData({type: MessageType.GameOverResponse});
  }

  private sendGameResponse(game: Game): void {
    this.peerService.sendData({type: MessageType.GameResponse, game});
  }
}
