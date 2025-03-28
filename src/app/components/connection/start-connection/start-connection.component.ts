import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {PeerService} from '../../../services/peer-service/peer-service.service';
import {Subscription} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-start-connection',
  imports: [],
  templateUrl: './start-connection.component.html'
})
export class StartConnectionComponent {
  constructor(protected peerService:PeerService) {}

  connect(peerId: string) {
    if (peerId) {
      this.peerService.connectTo(peerId);
    }
  }

  disconnect() {
    this.peerService.disconnect();
  }
}
