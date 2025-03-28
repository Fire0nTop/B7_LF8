import { Component } from '@angular/core';
import {PeerService} from '../../../services/peer.service';
import {FormsModule} from '@angular/forms';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule
  ],
  templateUrl: './chat.component.html'
})
export class ChatComponent {

  messages: Message[] = [];
  inputText = '';

  constructor(private peerService: PeerService) {
    peerService.onReceiveData.subscribe(data => {

    })
  }

  sendMessage(text:string) {
    if (this.peerService.isConnected()) {
      this.peerService.sendData(text);
    }
  }

  sendButtonClicked() {
    this.sendMessage(this.inputText)
  }
}
