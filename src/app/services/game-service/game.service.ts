import {Injectable, signal} from '@angular/core';
import {Board, Rotation} from '@models/game';
import {DatabaseService} from '@services/database-service/database.service';
import {CellStatus} from '@models/game/cellSatus';
import {Zug} from '@models/Zug';
import {Ship} from '@models/ship';
import {Attack, AttackResult, Game} from '@models/connection';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public readonly board: Board;
  public readonly moves: Zug[] = []
  public readonly ships = signal<Ship[]>([])

  public readonly selectedShip = signal<Ship | null>(null)
  public readonly selectedRotation = signal<Rotation>(Rotation.horizontal)

  constructor(public databaseService: DatabaseService) {
    this.board = new Board(Board.BOARD_SIZE,Board.BOARD_SIZE);
    databaseService.getAllShips().subscribe(value => this.ships.set(value))
  }

  public saveGameData(gameData: Game) {
    //TODO: save game data to DB get from getGameData with databaseService
  }

  public getGameData() {
    //TODO: return game data like placements and moves
    // return Game
  }

  public saveMoves(move: Zug) {
    //TODO: save move
  }

  public computeAttack(attack:Attack): AttackResult {
    this.attackCell(attack)
    const cellStatus = this.board.getCellStatus(attack.x,attack.y)
    let attackResult = AttackResult.Miss
    if (cellStatus === CellStatus.destroyed) {
      const shipId = this.board.board.getValue()[attack.x][attack.y].placedShipId
      if (shipId !== null && this.board.checkIfShipIsDestroyed(shipId)) {
        attackResult = AttackResult.Sunk
      } else {
        attackResult = AttackResult.Hit
      }
    }
    return attackResult
  }

  private attackCell(attack:Attack) {
    if (this.board.getCellStatus(attack.x, attack.y) === CellStatus.occupied) {
      this.board.setCellStatus(attack.x, attack.y,CellStatus.destroyed);
    }
  }
}
