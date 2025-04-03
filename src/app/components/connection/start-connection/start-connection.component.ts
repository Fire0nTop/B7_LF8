import { Component } from '@angular/core';
import { PeerService } from '@services/peer-service/peer-service.service';
import { GameService } from '@services/game-service/game.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'start-connection',
  standalone: true,
  templateUrl: './start-connection.component.html',
  imports: [
    JsonPipe
  ],
  styleUrls: ['./start-connection.component.scss']
})
export class StartConnectionComponent {
  constructor(
    protected peerService: PeerService,
    protected gameService: GameService
  ) {}


  connect(peerId: string) {
    if (peerId) {
      this.peerService.connectTo(peerId);
    }
  }

  disconnect() {
    this.peerService.disconnect();
  }
}
