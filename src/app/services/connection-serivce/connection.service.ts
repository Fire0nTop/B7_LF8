import {Injectable} from '@angular/core';
import {PeerService} from '../peer-service/peer-service.service';
import {Attack} from '../../models/connection';
import {AttackAnswer} from '../../models/connection';
import {AttackResult} from '../../models/connection';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private peerService: PeerService) {
    this.listenForMessages()
  }

  public connectToPeer(peerId: string) {
    this.peerService.connectTo(peerId);
  }

  public disconnect() {
    this.peerService.disconnect();
  }

  public getConnectedPeerId(): string | null {
    return this.peerService.getConnectedPeerId()
  }

  public sendAttack(attack:Attack): Promise<AttackAnswer> {
    return new Promise<AttackAnswer>((resolve) => {
      this.peerService.sendData({ type: 'attack', attack });

      const subscription = this.peerService.onDataReceived$.subscribe((data) => {
        if (data.type === 'attackAnswer') {
          resolve({attackResult: data.attackResult});
          subscription.unsubscribe();
        }
      });
    })
  }

  private listenForMessages(): void {
    this.peerService.onDataReceived$.subscribe((data) => {
      if (data.type === 'attack') {
        this.sendAttackResult(data);
        console.log(`Incoming attack at (${data.x}, ${data.y})`);
      } else if (data.type === 'gameOver') {
        console.log('Game Over received');
      }
    });
  }

  private sendAttackResult(attack:Attack): void {
    this.peerService.sendData({attackResult:AttackResult.miss} as AttackAnswer);
  }
}
