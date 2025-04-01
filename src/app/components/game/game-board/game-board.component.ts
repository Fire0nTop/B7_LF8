import { Component } from '@angular/core';
import {GameCellComponent} from '../game-cell/game-cell.component';
import {Board} from '../../../models/game/board';

@Component({
  selector: 'app-game-board',
  imports: [
    GameCellComponent
  ],
  templateUrl: './game-board.component.html'
})
export class GameBoardComponent {
  public board = new Board(10,10)

  constructor() {
    console.log(this.board)
  }

  protected readonly String = String;
}
