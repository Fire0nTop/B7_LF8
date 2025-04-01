import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private playerName = new BehaviorSubject<string>('');
  currentPlayerName = this.playerName.asObservable();

  setPlayerName(name: string) {
    this.playerName.next(name);
  }
  getPlayerName() {
    return this.playerName.asObservable();
  }
}
