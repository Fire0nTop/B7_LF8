import { Cell } from './cell';

export class Board {
  public board: Cell[][];

  constructor(public sizeX: number, public sizeY: number) {
    this.board = [];
    for (let x = 0; x < sizeX; x++) {
      let row: Cell[] = [];
      for (let y = 0; y < sizeY; y++) {
        row.push(new Cell());
      }
      this.board.push(row);
    }
  }
}
