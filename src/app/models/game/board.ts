import {Cell} from './cell';
import {Ship} from '@models/ship';
import {Rotation} from '@models/game/rotation';
import {CellStatus} from '@models/game/cellSatus';
import {BehaviorSubject, map} from 'rxjs';

export class Board {

  static readonly BOARD_SIZE = 10

  public board = new BehaviorSubject<Cell[][]>([]);

  private nextPlacedShipId = 0;

  constructor(public sizeX: number, public sizeY: number) {
    const initialBoard: Cell[][] = [];
    for (let x = 0; x < sizeX; x++) {
      let row: Cell[] = [];
      for (let y = 0; y < sizeY; y++) {
        row.push(new Cell());
      }
      initialBoard.push(row);
    }
    this.board.next(initialBoard);
  }

  public getCellStatus(x: number, y: number): CellStatus {
    return this.board.getValue()[x][y].status
  }

  public setCellStatus(x: number, y: number, status: CellStatus) {
    const updatedBoard = this.board.getValue().map(row => [...row]);
    updatedBoard[x][y].status = status;
    this.board.next(updatedBoard);
  }

  public placeShip(ship: Ship, x: number, y: number, rotation: Rotation): boolean {
    if (!this.checkShipPlacement(ship, x, y, rotation)) {
      return false;
    }

    const updatedBoard = this.board.getValue().map(row => [...row]);
    const placedShipId = this.nextPlacedShipId++;

    for (let dx = 0; dx < ship.horizontalSize; dx++) {
      for (let dy = 0; dy < ship.verticalSize; dy++) {
        const newX = rotation === Rotation.horizontal ? x + dx : x + dy;
        const newY = rotation === Rotation.horizontal ? y + dy : y + dx;
        const cell = updatedBoard[newX][newY];
        cell.content = ship;
        cell.status = CellStatus.occupied;
        cell.placedShipId = placedShipId;
      }
    }

    this.board.next(updatedBoard);
    return true;
  }

  private checkShipPlacement(ship: Ship, x: number, y: number, rotation: Rotation): boolean {
    for (let dx = 0; dx < ship.horizontalSize; dx++) {
      for (let dy = 0; dy < ship.verticalSize; dy++) {
        const newX = rotation === Rotation.horizontal ? x + dx : x + dy;
        const newY = rotation === Rotation.horizontal ? y + dy : y + dx;

        if (newX >= this.sizeX || newY >= this.sizeY || this.board.getValue()[newX][newY].status !== CellStatus.empty) {
          return false;
        }
      }
    }
    return true;
  }

  public checkIfShipIsDestroyed(placedShipId:number): boolean {
    const board = this.board.getValue();

    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        const cell = board[x][y];
        if (cell.placedShipId === placedShipId && cell.status !== CellStatus.destroyed) {
          return false;
        }
      }
    }
    return true;
  }
}
