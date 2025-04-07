import { Component } from '@angular/core';
import {GameService} from '@services/game-service/game.service';
import {Cell} from '@models/game';
import {GameSave} from '@models/connection/game-save';
import {Spieler} from '@models/Spieler';
import {CellStatus} from '@models/game/cellSatus';
import {Zug} from '@models/Zug';
import {DatabaseService} from '@services/database-service/database.service';
import {firstValueFrom} from 'rxjs';
import {Ship} from '@models/ship';

@Component({
  selector: 'app-test-game-save',
  imports: [],
  templateUrl: './test-game-save.component.html'
})
export class TestGameSaveComponent {
  constructor(
    private gameService: GameService,
    private databaseService: DatabaseService
  ) {}

  async createMockGame() {
    const boardSize = 10;
    const mockShipId = 2; // 🛑 Update this to match an existing ship ID in your DB!

    // Generate mock board with an existing ship placed
    const generateBoard = (shipId: number): Cell[][] => {
      const board: Cell[][] = [];
      for (let x = 0; x < boardSize; x++) {
        const row: Cell[] = [];
        for (let y = 0; y < boardSize; y++) {
          const cell = new Cell();
          if (x === 0 && y < 3) {
            cell.status = CellStatus.occupied;
            cell.placedShipId = shipId;
            cell.content = {
              shipId: shipId,
            } as Ship;
          }
          row.push(cell);
        }
        board.push(row);
      }
      return board;
    };

    const createMoves = (): Zug[] => [
      { spielId: -1, spielerId: -1, kordinateX: 0, kordinateY: 0, treffer: true, runde: 1 },
      { spielId: -1, spielerId: -1, kordinateX: 5, kordinateY: 5, treffer: false, runde: 2 },
    ];

    const player1 = new Spieler(0, 'mock_user_1');
    const player2 = new Spieler(0, 'mock_user_2');

    player1.spielerId = await this.getOrRegisterPlayer(player1.userName);
    player2.spielerId = await this.getOrRegisterPlayer(player2.userName);

    const game1: GameSave = {
      player: player1,
      placements: generateBoard(mockShipId),
      moves: createMoves().map(move => ({ ...move, spielerId: player1.spielerId })),
    };

    const game2: GameSave = {
      player: player2,
      placements: generateBoard(mockShipId),
      moves: createMoves().map(move => ({ ...move, spielerId: player2.spielerId })),
    };

    await this.gameService.saveGameData(game1, game2);
    console.log('Mock game saved with existing ship positions!');
  }

  private async getOrRegisterPlayer(username: string): Promise<number> {
    return new Promise<number>(resolve => {
      const sub = this.databaseService.getPlayerByUsername(username).subscribe(value => {
        if (value) {
          resolve(value.spielerId);
        } else {
          this.databaseService.registerPlayer(new Spieler(0, username)).subscribe(id => {
            resolve(id);
          });
        }
        sub.unsubscribe();
      });
    });
  }
}
