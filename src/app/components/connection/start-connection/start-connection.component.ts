import { Component } from '@angular/core';
import {ConnectionService} from '@services/connection-serivce/connection.service';

@Component({
  selector: 'app-start-connection',
  standalone: true,
  templateUrl: './start-connection.component.html',
  styleUrls: ['./start-connection.component.scss']
})
export class StartConnectionComponent {
  constructor(
    protected connectionService: ConnectionService
  ) {}

  connect(peerId: string) {
    if (peerId) {
      this.connectionService.connectToPeer(peerId);
    }
  }

  disconnect() {
    this.connectionService.disconnect();
  }
}
