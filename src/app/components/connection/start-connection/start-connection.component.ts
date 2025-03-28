import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {PeerService} from '../../../services/peer-service/peer-service.service';
import {Subscription} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {LandigPageComponent} from '../../pages/landig-page/landig-page.component';

@Component({
  selector: 'app-start-connection',
  imports: [],
  templateUrl: './start-connection.component.html',
  styleUrls: ['./start-connection.component.scss']
})
export class StartConnectionComponent {
  constructor(protected peerService:PeerService, protected landingService: LandigPageComponent) {}

  connect(peerId: string) {
    if (peerId) {
      this.peerService.connectTo(peerId);
    }
  }

  disconnect() {
    this.peerService.disconnect();
  }
}
