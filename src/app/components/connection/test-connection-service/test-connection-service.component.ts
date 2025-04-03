import {Component, signal} from '@angular/core';
import {ConnectionService} from '@services/connection-serivce/connection.service';
import {FormsModule} from '@angular/forms';
import {Attack, AttackResult} from '@models/connection';

@Component({
  selector: 'app-test-connection-service',
  imports: [
    FormsModule
  ],
  templateUrl: './test-connection-service.component.html'
})
export class TestConnectionServiceComponent {
  username = '';
  peerId = '';
  attack:Attack = {x:0,y:0};
  receivedAttack = signal<String>('')
  receivedAttackResult = signal<String>('')
  attackResponse = signal<string>('')
  receivedUsername = signal<string>('');
  connectedPeerId = signal<string | null>(null);

  constructor(protected connectionService: ConnectionService) {
    this.setUpSubscribers();
  }

  setUsername() {
    this.connectionService.username.set(this.username);
  }

  sendUsername() {
    this.connectionService.sendUsername().then((response) => {
      this.receivedUsername.set(response);
    });
  }

  connectToPeer() {
    if (this.peerId) {
      this.connectionService.connectToPeer(this.peerId);
      this.connectedPeerId.set(this.peerId);
    }
  }

  disconnect() {
    this.connectionService.disconnect();
    this.connectedPeerId.set(null);
  }

  sendAttack() {
    console.log("send Attack",this.attack)
    this.connectionService.sendAttack(this.attack).then((response) => {
      this.attackResponse.set(response.attackResult.toString())
    })
  }

  private setUpSubscribers() {
    this.connectionService.onAttackReceived.subscribe((data) => {
      this.receivedAttack.set("X: " + data.x + ", y: " + data.y);
    })

    this.connectionService.onAttackResultReceived.subscribe((data) => {
      this.receivedAttackResult.set(AttackResult[data]);
    })
  }
}
