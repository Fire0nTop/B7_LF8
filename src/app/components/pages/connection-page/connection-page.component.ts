import { Component } from '@angular/core';
import {StartConnectionComponent} from '../../connection/start-connection/start-connection.component';

@Component({
  selector: 'app-connection-page',
  imports: [
    StartConnectionComponent
  ],
  templateUrl: './connection-page.component.html'
})
export class ConnectionPageComponent {

}
