import {Cell} from './cell';

export class Board {

  public board: [Cell[]];

  constructor(public sizeX:number, sizeY:number) {
    let board: [Cell[]] = [[]]
    for (let x = 0; x < sizeX; x++) {
      let a: Cell[] = []
      for (let y = 0; y < sizeY; y++) {
        a.push(new Cell())
      }
      board.push(a)
    }
    this.board = board
  }
}
