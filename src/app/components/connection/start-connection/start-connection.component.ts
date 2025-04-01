import { Component } from '@angular/core';
import { PeerService } from '@services/peer-service/peer-service.service';
import { GameService } from '@services/game-service/game.service';

@Component({
  selector: 'start-connection',
  standalone: true,
  templateUrl: './start-connection.component.html',
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
