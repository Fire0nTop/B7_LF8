import { Component } from '@angular/core';
import {GameBoardComponent} from './game-board/game-board.component';
import {PlayerStatsComponent} from './player-stats/player-stats.component';

@Component({
  selector: 'app-game',
  imports: [
    GameBoardComponent,
    PlayerStatsComponent
  ],
  templateUrl: './game.component.html'
})
export class GameComponent {

}
