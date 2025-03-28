import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PeerService} from '../../../services/peer-service/peer-service.service';

export interface Message {
  text: string;
  sender: 'user' | 'other';
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
    peerService.onDataReceived$.subscribe(data => {
        this.messages.push({
          text:data,
          sender: "other"
        })
    })
  }

  sendMessage(text:string) {
    if (this.peerService.isConnected()) {
      this.peerService.sendData(text);
      this.messages.push({text:text,sender:"user"})
    }
  }

  sendButtonClicked() {
    this.sendMessage(this.inputText)
  }
}
