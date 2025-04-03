import { DataConnection, Peer } from 'peerjs';
import { Injectable, signal, DestroyRef, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peer!: Peer;
  private connection: DataConnection | null = null;
  private destroyRef = inject(DestroyRef);

  // Signals
  public peerId = signal<string>('');
  public isConnected = signal(false);
  public connectionError = signal<string | null>(null);
  public connectedPeerId = signal<string | null>(null);

  // Observables
  private dataReceived$ = new Subject<any>();
  public onDataReceived$: Observable<any> = this.dataReceived$.pipe(
    takeUntilDestroyed(this.destroyRef)
  );

  constructor() {
    this.initializePeer();
    this.registerCleanup();
  }

  public connectTo(peerId: string): void {
    this.cleanupExistingConnection();
    this.connection = this.peer.connect(peerId);
    this.setupConnectionHandlers();
  }

  public sendData(data: any): boolean {
    if (!this.connection?.open) return false;

    try {
      this.connection.send(data);
      return true;
    } catch (error) {
      this.connectionError.set('Failed to send data');
      return false;
    }
  }

  public disconnect(): void {
    this.cleanupExistingConnection();
  }

  private initializePeer(): void {
    this.peer = new Peer();

    this.peer.on('open', (id) => this.peerId.set(id));
    this.peer.on('connection', (conn) => this.handleIncomingConnection(conn));
    this.peer.on('error', (error) => this.connectionError.set(error.message));
  }

  private handleIncomingConnection(conn: DataConnection): void {
    this.cleanupExistingConnection();
    this.connection = conn;
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.on('open', () => {
      this.connectedPeerId.set(this.connection!.peer);
      this.isConnected.set(true);
    });

    this.connection.on('data', (data) => this.dataReceived$.next(data));
    this.connection.on('close', () => this.cleanupConnection());
    this.connection.on('error', (error) => {
      this.connectionError.set(error.message);
      this.cleanupConnection();
    });
  }

  private cleanupExistingConnection(): void {
    if (this.connection) {
      this.connection.close();
    }
    this.cleanupConnection();
  }

  private cleanupConnection(): void {
    this.connection = null;
    this.connectedPeerId.set(null);
    this.isConnected.set(false);
  }

  private registerCleanup(): void {
    this.destroyRef.onDestroy(() => {
      this.cleanupExistingConnection();
      this.peer.destroy();
    });
  }
}
