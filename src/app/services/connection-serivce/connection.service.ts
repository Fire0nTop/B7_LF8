import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {PeerService} from '../peer-service/peer-service.service';
import {Attack, AttackResponse, AttackResult} from '@models/index';
import {Observable, Subject} from 'rxjs';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {MessageType} from '@models/connection/message-types';
import {GameService} from '@services/game-service/game.service';
import {GameSave} from '@models/connection/game-save';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  peerId = computed(() => this.peerService.peerId());
  isConnected = computed(() => this.peerService.isConnected());
  connectionError = computed(() => this.peerService.connectionError());
  connectedPeerId = computed(() => this.peerService.connectedPeerId());
  username = signal<string>("");
  otherUsername = signal<string>('');
  isReady = signal<boolean>(false)
  otherIsReady = signal<boolean>(false)
  savedGameId = signal<string>('');

  attackReceived = new Subject<Attack>();
  attackResultReceived = new Subject<AttackResponse>();
  private destroyRef = inject(DestroyRef);
  public onAttackReceived: Observable<Attack> = this.attackReceived.pipe(
    takeUntilDestroyed(this.destroyRef)
  );
  public onAttackResultReceived: Observable<AttackResponse> = this.attackResultReceived.pipe(
    takeUntilDestroyed(this.destroyRef)
  );

  constructor(private peerService: PeerService, public gameService: GameService) {
    this.listenForMessages();
    this.onAttackResultReceived.subscribe((data) => {
      console.log("data", data);
      switch (data.attackResult) {
        case AttackResult.Miss:
          gameService.destroyedShips.set(new Map(gameService.destroyedShips().set(gameService.coordsKeyFromAttack(data.attack), data)));
          break;
        case AttackResult.Hit:
          gameService.destroyedShips.set(new Map(gameService.destroyedShips().set(gameService.coordsKeyFromAttack(data.attack), data)));
          break;
        case AttackResult.Sunk:
          if (data.destroyedShipPositions) {
            data.destroyedShipPositions.forEach(position => {
              gameService.destroyedShips.set(new Map(gameService.destroyedShips().set(gameService.coordsKeyFromAttack(position), data)));
            })
          }
          break;
      }
      console.log("destroyedShips", gameService.destroyedShips())
    });

    toObservable(this.isReady).subscribe(isReady => {
      if (isReady && this.otherIsReady()) {
        gameService.newRound()
      }
    })
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
          resolve({
            attackResult: data.attackResult,
            attack: attack,
            destroyedShip: data.destroyedShip,
            destroyedShipPositions: data.destroyedShipCells
          });
          subscription.unsubscribe();
        }
      });
    });
  }
  public sendUsername(): Promise<string> {
    const username = this.username();
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

  public sendReady(isReady: boolean): Promise<boolean> {

    if (this.gameService.ships().map(ship => this.gameService.board.getShipCountLeft(ship)).filter(shipCount => shipCount > 0).length > 1) {
      return new Promise<boolean>(() => false)
    }

    this.isReady.set(isReady);

    return new Promise<boolean>((resolve) => {
      this.peerService.sendData({type: MessageType.Ready, ready: isReady});

      const subscription = this.peerService.onDataReceived$.subscribe((data) => {
        if (data.type === MessageType.ReadyResponse) {
          this.otherIsReady.set(data.ready);
          resolve(data.ready);
          subscription.unsubscribe();
        }
      });
    });
  }

  public sendGameOver() {
    this.peerService.sendData({type: MessageType.GameOver, winner: this.peerId()});
  }


  private listenForMessages(): void {
    this.peerService.onDataReceived$.subscribe((data) => {
      switch (data.type) {
        case MessageType.Attack:
          console.log(`Incoming attack at (${data.attack.x}, ${data.attack.y})`);
          this.sendAttackResponse(data.attack);
          this.attackReceived.next(data.attack);
          this.gameService.newRound()
          break;

        case MessageType.AttackResponse:
          console.log('received attackResponse', data);
          this.attackResultReceived.next(data);
          this.computeAttackResponse(data)
          this.gameService.newRound()
          console.log(this.gameService.ships().every(ship => this.gameService.getDestroyedShipCount(ship) == ship.shipCount),this.gameService.ships().map(ship => {
            return {count:this.gameService.getDestroyedShipCount(ship) ,shipMaxCount: ship.shipCount, ship: ship};
          }))
          if (this.gameService.ships().every(ship => this.gameService.getDestroyedShipCount(ship) == ship.shipCount)) {
            this.sendGameOver()
          }
          break;

        case MessageType.GameOver:
          console.log('Game Over received', data.winner);
          this.gameService.gameOver(data.winner);
          this.sendGameOverResponse(data.winner);
          break;

        case MessageType.GameOverResponse:
          console.log('Game OverResponse received', data.winner);
          this.gameService.gameOver(data.winner);
          break;

        case MessageType.GameStart:
          console.log('Game Start received: ', data.startPeerId);
          this.sendGameStartResponse(data.startPeerId);
          this.gameService.newRound()
          if (data.startPeerId === this.peerId()) {
            this.gameService.isAttacking.set(true)
          }
          break;

        case MessageType.GameStartResponse:
          console.log('Game Start Response received: ', data.startPeerId);
          this.gameService.newRound()
          if (data.startPeerId === this.peerId()) {
            this.gameService.isAttacking.set(true)
          }
          break;

        case MessageType.Username:
          console.log('Username received: ', data.username);
          this.sendUsernameAnswer();
          this.otherUsername.set(data.username);
          break;

        case MessageType.UsernameResponse:
          console.log('Username Response received: ', data.username);
          this.otherUsername.set(data.username);
          break;

        case MessageType.SaveGameRequest:
          console.log('SaveGameRequest received');
          this.sendSaveGameData()
          break;

        case MessageType.SaveGame:
          console.log('SaveGame received: ', data.saveGame);
          this.sendSaveGameResponse(data.saveGame)
          break;

        case MessageType.SaveGameResponse:
          console.log('SaveGame Response received: ', data.saveGame);
          this.savedGameId.set(data.saveGame.toString());
          break;

        case MessageType.Ready:
          console.log('Ready received: ', data.ready);
          this.sendReadyResponse();
          break;

        case MessageType.ReadyResponse:
          console.log('Ready Response received: ', data.ready);
          this.otherIsReady.set(data.ready);
          if (this.isReady() && this.otherIsReady()) {
            this.sendGameStart(this.peerId())
          }
          break;
      }
    });
  }

  private sendAttackResponse(attack: Attack): void {
    const ship = this.gameService.board.board.getValue()[attack.x][attack.y].content
    const attackResult = this.gameService.computeAttack(attack)
    const placedShipId = this.gameService.board.board.getValue()[attack.x][attack.y].placedShipId
    const destroyedShipCells = placedShipId !== null ? this.gameService.board.getAllPositionsOfPlaceId(placedShipId) : null;
    console.log(destroyedShipCells, placedShipId)
    this.peerService.sendData({
      type: MessageType.AttackResponse,
      attackResult: attackResult,
      attack: attack,
      destroyedShip: attackResult === AttackResult.Sunk ? ship : null,
      destroyedShipPositions: attackResult === AttackResult.Sunk && destroyedShipCells ? destroyedShipCells : null,
    });

    if (attackResult !== AttackResult.Miss) {
      this.gameService.isAttacking.set(false)
    } else {
      this.gameService.isAttacking.set(true)
    }
  }

  private sendUsernameAnswer() {
    this.peerService.sendData({type: MessageType.UsernameResponse, username: this.username() || 'Player'});
  }

  private sendGameOverResponse(winner: string) {
    this.peerService.sendData({type: MessageType.GameOverResponse, winner: winner});
  }

  private sendGameStartResponse(startPeerId:string): void {
    this.peerService.sendData({type: MessageType.GameStartResponse, startPeerId:startPeerId});
  }

  private async sendSaveGameResponse(saveGame:GameSave) {
    const gameId = await this.gameService.saveGameData(await this.gameService.getGameSave(this.username()), saveGame)
    console.log(await this.gameService.getGameSave(this.username()), saveGame)
    this.savedGameId.set(gameId.toString())
    this.peerService.sendData({type: MessageType.SaveGameResponse, saveGame: gameId});
  }

  private computeAttackResponse(data: any) {
    if (data.attackResult !== null) {
      this.gameService.saveMove(data.attack, data.attackResult)
      if (data.attackResult !== AttackResult.Miss) {
        this.gameService.isAttacking.set(true)
      } else {
        this.gameService.isAttacking.set(false)
      }
    }
  }

  private sendReadyResponse() {
    this.peerService.sendData({type: MessageType.ReadyResponse, ready: this.isReady()});
  }

  private sendGameStart(startPeerId: string) {
    this.peerService.sendData({type: MessageType.GameStart, startPeerId:startPeerId});
  }

  public requestGameSave() {
    this.peerService.sendData({type:MessageType.SaveGameRequest})
  }

  private async sendSaveGameData() {
    this.peerService.sendData({
      type: MessageType.SaveGame,
      saveGame: await this.gameService.getGameSave(this.username())
    })
  }

  sendGameDataViaEmail() {
    //TODO: Email versand einbinden
  }
}
