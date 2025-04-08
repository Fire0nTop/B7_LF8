import {Component, signal} from '@angular/core';
import {GameCellComponent} from '../game-cell/game-cell.component';
import {Board} from '@models/game';
import {AttackGameCellComponent} from '@components/game/attack-game-cell/attack-game-cell.component';
import {GameService} from '@services/game-service/game.service';
import {toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-board',
  imports: [
    GameCellComponent,
    AttackGameCellComponent
  ],
  templateUrl: './game-board.component.html'
})
export class GameBoardComponent {
  protected readonly String = String;
  public board = new Board(Board.BOARD_SIZE,Board.BOARD_SIZE)

  constructor(protected gameService: GameService) {}
}
