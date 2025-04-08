import { Component } from '@angular/core';
import {GameBoardComponent} from './game-board/game-board.component';
import {PlayerStatsComponent} from './player-stats/player-stats.component';
import {GameService} from '@services/game-service/game.service';

@Component({
  selector: 'app-game',
  imports: [
    GameBoardComponent,
    PlayerStatsComponent,

  ],
  templateUrl: './game.component.html'
})
export class GameComponent {

  constructor(protected gameService: GameService) {
  }

}
