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
  peerService = inject(PeerService);
  status = signal('Disconnected');

  constructor() {
    effect(() => {
      this.status.set(
        this.peerService.isConnected()
          ? `Connected to ${this.peerService.getConnectedPeerId() || 'peer'}`
          : 'Disconnected'
      );
    });
  }

  connect(peerId: string) {
    if (peerId) {
      this.status.set('Connecting...');
      this.peerService.connectTo(peerId);
    }
  }

  disconnect() {
    this.peerService.disconnect();
  }
}
