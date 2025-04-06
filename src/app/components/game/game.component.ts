import { Component } from '@angular/core';
import {GameBoardComponent} from './game-board/game-board.component';
import {PlayerStatsComponent} from './player-stats/player-stats.component';
import {
  TestConnectionServiceComponent
} from '@components/connection/test-connection-service/test-connection-service.component';
import {GameService} from '@services/game-service/game.service';

@Component({
  selector: 'app-game',
  imports: [
    GameBoardComponent,
    PlayerStatsComponent,
    TestConnectionServiceComponent
  ],
  templateUrl: './game.component.html'
})
export class GameComponent {

  constructor(protected gameService: GameService) {
  }

}
