import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ConnectionService } from './connection.service';
import { PeerService } from '../peer-service/peer-service.service';
import { GameService } from '@services/game-service/game.service';
import { AttackResult } from '@models/index';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';
import {MessageType} from '@models/connection/message-types';

// Mock Implementierungen
class MockPeerService {
  peerId = signal<string>('test-peer-id');
  isConnected = signal<boolean>(false);
  connectionError = signal<string | null>(null);
  connectedPeerId = signal<string | null>(null);
  onDataReceived$ = new Subject<any>();

  connectTo = jasmine.createSpy('connectTo');
  disconnect = jasmine.createSpy('disconnect');
  sendData = jasmine.createSpy('sendData').and.callFake((data: any) => {
    // Simuliere Antwort für bestimmte Nachrichtentypen
    if (data.type === MessageType.Username) {
      setTimeout(() => {
        this.onDataReceived$.next({
          type: MessageType.UsernameResponse,
          username: 'mock-user'
        });
      }, 10);
    }
  });
}

class MockGameService {
  board = {
    board: signal<any[][]>([]),
    getShipCountLeft: jasmine.createSpy('getShipCountLeft').and.returnValue(0),
    getAllPositionsOfPlaceId: jasmine.createSpy('getAllPositionsOfPlaceId').and.returnValue([])
  };

  ships = signal<any[]>([]);
  destroyedShips = signal(new Map());
  isAttacking = signal(false);

  newRound = jasmine.createSpy('newRound');
  computeAttack = jasmine.createSpy('computeAttack').and.returnValue(AttackResult.Miss);
  saveGameData = jasmine.createSpy('saveGameData').and.returnValue(Promise.resolve('game-id'));
  getGameSave = jasmine.createSpy('getGameSave').and.returnValue(Promise.resolve({}));
}

describe('ConnectionService', () => {
  let service: ConnectionService;
  let peerService: MockPeerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConnectionService,
        { provide: PeerService, useClass: MockPeerService },
        { provide: GameService, useClass: MockGameService }
      ]
    });

    service = TestBed.inject(ConnectionService);
    peerService = TestBed.inject(PeerService) as unknown as MockPeerService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.username()).toBe('');
    expect(service.otherUsername()).toBe('');
    expect(service.isReady()).toBeFalse();
  });

  it('should connect to peer', () => {
    const testId = 'test-peer-123';
    service.connectToPeer(testId);
    expect(peerService.connectTo).toHaveBeenCalledWith(testId);
  });

  it('should disconnect', () => {
    service.disconnect();
    expect(peerService.disconnect).toHaveBeenCalled();
  });

  it('should send username and receive response', fakeAsync(() => {
    service.username.set('test-user');

    service.sendUsername().then(response => {
      expect(response).toBe('mock-user');
      expect(service.otherUsername()).toBe('mock-user');
    });

    tick(20);
  }));

});
