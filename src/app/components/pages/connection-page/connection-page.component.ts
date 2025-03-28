import { Component } from '@angular/core';
import {StartConnectionComponent} from '../../connection/start-connection/start-connection.component';
import {ChatComponent} from '../../connection/chat/chat.component';

@Component({
  selector: 'app-connection-page',
  imports: [
    StartConnectionComponent,
    ChatComponent
  ],
  templateUrl: './connection-page.component.html'
})
export class ConnectionPageComponent {

}
