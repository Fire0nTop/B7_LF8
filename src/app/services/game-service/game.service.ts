import {Injectable} from '@angular/core';
import {Board} from '@models/game';
import {DatabaseService} from '@services/database.service';
import {CellStatus} from '@models/game/cellSatus';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public board: Board;

  constructor(private databaseService: DatabaseService) {
    this.board = new Board(Board.BOARD_SIZE,Board.BOARD_SIZE);
  }

  public saveGameData() {
    //TODO: save game data to DB get from getGameData with databaseService
  }

  public getGameData() {
    //TODO: return game data like placements and moves
  }

  public attackCell(x: number, y: number) {
    if (this.board.getCellStatus(x, y) === CellStatus.occupied) {
      this.board.setCellStatus(x, y,CellStatus.destroyed);
    }
  }

}
