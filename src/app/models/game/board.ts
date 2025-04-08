import {Cell} from './cell';
import {Ship} from '@models/ship';
import {Rotation} from '@models/game/rotation';
import {CellStatus} from '@models/game/cellSatus';
import {BehaviorSubject} from 'rxjs';
import {Attack} from '@models/connection';
import {signal} from '@angular/core';

export class Board {

  static readonly BOARD_SIZE = 10

  public board = new BehaviorSubject<Cell[][]>([]);
  public readonly placedShips = signal<Ship[]>([])
  private nextPlacedShipId = 0;

  constructor(public sizeX: number, public sizeY: number) {
    const initialBoard: Cell[][] = [];
    for (let x = 0; x < sizeX; x++) {
      const row: Cell[] = [];
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
    this.placedShips.set([...this.placedShips(), ship]);
    return true;
  }

  public removeShip(x: number, y: number) {
    const currentCell = this.board.getValue()[x][y]
    if (currentCell.placedShipId !== null) {
      const positions = this.getAllPositionsOfPlaceId(currentCell.placedShipId);

      const ships = [...this.placedShips()];
      const ship = currentCell.content
      if (ship) {
        const index = ships.findIndex(s => s.shipId === ship.shipId);
        if (index !== -1) {
          ships.splice(index, 1);
          this.placedShips.set(ships);
        }
      }

      const updatedBoard = this.board.getValue().map(row => [...row]);
      positions.forEach((position) => {
        updatedBoard[position.x][position.y].content = null;
        updatedBoard[position.x][position.y].status = CellStatus.empty;
        updatedBoard[position.x][position.y].placedShipId = null;
      })
      this.board.next(updatedBoard);
    }
  }

  public checkIfShipIsDestroyed(placedShipId: number): boolean {
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

  public getAllCellsOfPlaceId(placedShipId: number): Cell[] {
    const board = this.board.getValue();
    const cells: Cell[] = []

    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        const cell = board[x][y];
        if (cell.placedShipId === placedShipId) {
          cells.push(cell);
        }
      }
    }
    return cells;
  }

  public getAllPositionsOfPlaceId(placedShipId: number): Attack[] {
    const board = this.board.getValue();
    const positions: Attack[] = []

    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        const cell = board[x][y];
        if (cell.placedShipId === placedShipId) {
          positions.push({x: x, y: y});
        }
      }
    }
    return positions;
  }

  public getShipCountLeft(ship: Ship): number {
    return ship.shipCount - this.placedShips().filter(value => value.shipId == ship.shipId).length;
  }

  private checkShipPlacement(ship: Ship, x: number, y: number, rotation: Rotation): boolean {
    if (this.getShipCountLeft(ship) < 1) return false;

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

  public getRotationOfCoords(positions: Attack[]): Rotation | null {
    if (positions.length < 2) return null;

    const sortedByY = [...positions].sort((a, b) => a.y - b.y);
    const sortedByX = [...positions].sort((a, b) => a.x - b.x);

    const allSameX = positions.every(pos => pos.x === positions[0].x);
    const allSameY = positions.every(pos => pos.y === positions[0].y);

    const isSequential = (nums: number[]) =>
      nums.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);

    if (allSameX && isSequential(sortedByY.map(p => p.y))) {
      return Rotation.horizontal;
    }

    if (allSameY && isSequential(sortedByX.map(p => p.x))) {
      return Rotation.vertical;
    }

    return null;
  }
}
