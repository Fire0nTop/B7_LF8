import {Injectable, Signal} from '@angular/core';
import {PeerService} from '../peer-service/peer-service.service';
import {MessageData} from '../../models/connection';
import {GameData} from '../../models/connection';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private messageReceived$ = new Subject<MessageData>();
  private gameDataReceived$ = new Subject<GameData>();

  // Public observables for consumers
  public onMessage$ = this.messageReceived$.asObservable();
  public onGameData$ = this.gameDataReceived$.asObservable();

  constructor(private peerService: PeerService) {
    this.peerService.onDataReceived$.subscribe(data => {
      this.handleIncomingData(data);
    });
  }

  public sendMessage(messageData: MessageData): boolean {
    return this.peerService.sendData({
      type: 'message',
      ...messageData
    });
  }

  public sendGameData(gameData: GameData): boolean {
    return this.peerService.sendData({
      type: 'gameData',
      ...gameData
    });
  }

  private handleIncomingData(data: unknown): void {
    if (this.isMessageData(data)) {
      this.messageReceived$.next(data);
    } else if (this.isGameData(data)) {
      this.gameDataReceived$.next(data);
    }
  }

  private isMessageData(data: any): data is MessageData {
    return data?.type === 'message' &&
      typeof data.text === 'string' &&
      data.timestamp !== undefined;
  }

  private isGameData(data: any): data is GameData {
    return data?.type === 'gameData' &&
      data.gameState !== undefined &&
      data.playerActions !== undefined;
  }
}
