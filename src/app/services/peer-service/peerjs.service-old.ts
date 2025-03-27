import { DataConnection, Peer } from 'peerjs';
import { EventEmitter, Injectable, Output, signal } from '@angular/core';

const onReceiveData = new EventEmitter<any>();
const onConnection = new EventEmitter<any>();
let peer: Peer = new Peer();
let conn: DataConnection | undefined = undefined;
const peerId = signal("");
let isConnected = signal(false);

function initConnection(connection: DataConnection) {
  conn = connection
  conn.on('open', function() {
    onConnection.emit(conn?.peer)
    isConnected.set(true);
    conn?.on('data', function(data:any) {
      onReceiveData.emit(data)
      console.log(data);
    });
  });
}

@Injectable({
  providedIn: 'root',
})
export class PeerjsServiceOld {

  @Output() onReceiveData = onReceiveData;
  @Output() onConnection = onConnection;
  peerId = peerId;
  isConnected = isConnected;

  constructor() {

    peer.on('open', function(id : string) {
      peerId.set(id)
    })
    peer.on('connection', function (c:any) {
      initConnection(c)
    });
  }

  connectTo(otherPeerId: string) {
    console.log("Try connecting to: " + otherPeerId);
    initConnection(peer.connect(otherPeerId))
  }

  sendData(data: any) {
    if(conn) {
      if(conn.open) {
        conn.send(data)
      }
    }
  }

  get otherPeerId() {
    return conn?.peer
  }
}
