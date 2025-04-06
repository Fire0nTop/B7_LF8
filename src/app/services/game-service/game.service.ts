import {Injectable, signal} from '@angular/core';
import {Board, Rotation} from '@models/game';
import {DatabaseService} from '@services/database-service/database.service';
import {CellStatus} from '@models/game/cellSatus';
import {Zug} from '@models/Zug';
import {Ship} from '@models/ship';
import {Attack, AttackResponse, AttackResult, Game} from '@models/connection';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public readonly board: Board;
  public moves: Zug[] = []

  public readonly selectedShip = signal<Ship | null>(null)
  public readonly isRemoving = signal<boolean>(false)
  public readonly selectedRotation = signal<Rotation>(Rotation.horizontal)

  public readonly round = signal<number>(0)
  public readonly isAttacking = signal<boolean>(false)

  public readonly ships = signal<Ship[]>([])

  public readonly destroyedShips = signal<Map<string,AttackResponse>>(new Map)

  public readonly isDebugging = signal<boolean>(true)

  constructor(public databaseService: DatabaseService) {
    this.board = new Board(Board.BOARD_SIZE,Board.BOARD_SIZE);
    databaseService.getAllShips().subscribe(value => this.ships.set(value))
    toObservable(this.isAttacking).subscribe(value => console.log("isAttacking",value))
  }

  public saveGameData(gameData: Game) {
    //TODO: save game data to DB get from getGameData with databaseService
  }

  public getGameData() {
    //TODO: return game data like placements and moves
    // return Game
  }

  public saveMove(attack:Attack,attackResult:AttackResult) {
    //TODO playerId and gameID set
    this.moves.push({
      treffer: attackResult !== AttackResult.Miss,
      runde: this.round(),
      kordinateX: attack.x,
      kordinateY: attack.y,
      spielerId: -1,
      spielId: -1,
    })
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
    console.log("getting cell at", attack.x, attack.y, "=>", this.board.board.getValue()[attack.x][attack.y]);
  }

  public coordsKeyFromAttack(attack: { x: number, y: number }): string {
    return `${attack.x},${attack.y}`;
  }

  public attackFromKeyCoords(key: string): { x: number, y: number } {
    const [x, y] = key.split(',').map(Number); // Convert the split parts back to numbers
    return { x, y };
  }

  public getDestroyedShipCount(ship: Ship): number {
    let destroyedShipCellCount = 0
    this.destroyedShips().forEach((value, key) => {
      if (value.destroyedShip?.shipId == ship.shipId) {
        destroyedShipCellCount += 1;
      }
    })
    return destroyedShipCellCount / ship.horizontalSize * ship.verticalSize;
  }

  public cleanUp(): void {
    this.round.set(0)
    this.moves = []
  }

  public newRound() {
    this.round.set(this.round() + 1)
  }

  gameOver(winner:string) {
    this.isAttacking.set(false)
    //TODO: add navigate to winner page
  }
}
