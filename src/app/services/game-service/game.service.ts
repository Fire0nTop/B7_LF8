import {Injectable, signal} from '@angular/core';
import {Board, Rotation} from '@models/game';
import {DatabaseService} from '@services/database-service/database.service';
import {CellStatus} from '@models/game/cellSatus';
import {Zug} from '@models/Zug';
import {Ship} from '@models/ship';
import {Attack, AttackResponse, AttackResult} from '@models/connection';
import {toObservable} from '@angular/core/rxjs-interop';
import {Spieler} from '@models/Spieler';
import {firstValueFrom} from 'rxjs';
import {GameSave} from '@models/connection/game-save';
import {Router} from '@angular/router';

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

  public readonly destroyedShips = signal<Map<string, AttackResponse>>(new Map)

  public readonly isDebugging = signal<boolean>(false)

  public readonly isShowingAttackBoard = signal<boolean>(false)

  public readonly winnerUuid = signal<string>('')

  constructor(public databaseService: DatabaseService, public router: Router) {
    this.board = new Board(Board.BOARD_SIZE, Board.BOARD_SIZE);
    databaseService.getAllShips().subscribe(value => this.ships.set(value))
    toObservable(this.isAttacking).subscribe(value => console.log("isAttacking", value))
    toObservable(this.isAttacking).subscribe(isAttacking => {
      this.isShowingAttackBoard.set(isAttacking);
    })
  }

  public async saveGameData(ownGameSave: GameSave, otherGameSave: GameSave) {
    const gameId = await firstValueFrom(this.databaseService.createGame());

    const player = ownGameSave.player;
    const opponent = otherGameSave.player;

    // Save ship positions for both players
    for (const [save, spieler] of [
      [ownGameSave, player],
      [otherGameSave, opponent]
    ] as const) {
      for (let x = 0; x < save.placements.length; x++) {
        for (let y = 0; y < save.placements[x].length; y++) {
          const cell = save.placements[x][y];
          if (cell.placedShipId !== null && cell.content) {
            await firstValueFrom(this.databaseService.saveShipPosition({
              schiffPositionId: 0,
              schiffId: cell.content.shipId,
              spielId: gameId, // Game ID correctly mapped
              spielerId: spieler.spielerId, // Player ID correctly mapped
              positionX: x,
              positionY: y,
              zerstoert: cell.status === CellStatus.destroyed
            }));
          }
        }
      }
    }

    // Save moves for the player
    for (const move of ownGameSave.moves) {
      await firstValueFrom(this.databaseService.saveMove({
        ...move,
        spielId: gameId, // Correct game ID is passed here
        spielerId: ownGameSave.player.spielerId // Player's ID is used
      }));
    }

    // Save moves for the opponent
    for (const move of otherGameSave.moves) {
      await firstValueFrom(this.databaseService.saveMove({
        ...move,
        spielId: gameId, // Correct game ID is passed here
        spielerId: otherGameSave.player.spielerId // Opponent's ID is used
      }));
    }
    return gameId
  }

  public async getGameSave(userName: string): Promise<GameSave> {
    const placements = this.board.board.getValue();
    const moves = this.moves;

    // get or create player
    let player = await firstValueFrom(this.databaseService.getPlayerByUsername(userName));
    if (!player) {
      const playerId = await firstValueFrom(this.databaseService.registerPlayer(new Spieler(0, userName)));
      player = new Spieler(playerId, userName);
    }

    return {
      player: player,
      placements: placements,
      moves: moves,
    };
  }

  public saveMove(attack: Attack, attackResult: AttackResult) {
    this.moves.push({
      treffer: attackResult !== AttackResult.Miss,
      runde: this.round(),
      kordinateX: attack.x,
      kordinateY: attack.y,
      spielerId: -1, // set in saveGameData()
      spielId: -1, // set in saveGameData()
    })
  }

  public computeAttack(attack: Attack): AttackResult {
    this.attackCell(attack)
    const cellStatus = this.board.getCellStatus(attack.x, attack.y)
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

  public coordsKeyFromAttack(attack: { x: number, y: number }): string {
    return `${attack.x},${attack.y}`;
  }

  public attackFromKeyCoords(key: string): { x: number, y: number } {
    const [x, y] = key.split(',').map(Number); // Convert the split parts back to numbers
    return {x, y};
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

  gameOver(winner: string) {
    this.isAttacking.set(false)
    this.winnerUuid.set(winner)
    this.router.navigate(['gameOver'])
  }

  private getPlayerByUserName(userName: string) {
    return new Promise<number>(resolve => {
      const sub = this.databaseService.getPlayerByUsername(userName).subscribe(value => {
        if (value) {
          resolve(value.spielerId)
        } else {
          this.databaseService.registerPlayer(new Spieler(0, userName)).subscribe(value => {
            resolve(value)
          })
        }
        sub.unsubscribe()
      })
    })
  }

  private attackCell(attack: Attack) {
    if (this.board.getCellStatus(attack.x, attack.y) === CellStatus.occupied) {
      this.board.setCellStatus(attack.x, attack.y, CellStatus.destroyed);
    }
    console.log("getting cell at", attack.x, attack.y, "=>", this.board.board.getValue()[attack.x][attack.y]);
  }
}
