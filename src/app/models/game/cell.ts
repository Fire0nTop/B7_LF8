import {Ship} from '@models/ship';
import {CellStatus} from '@models/game/cellSatus';

export class Cell {

  content: Ship | null = null
  status: CellStatus = CellStatus.empty

  constructor() {}
}
