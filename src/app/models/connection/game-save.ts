import {Zug} from '@models/Zug';
import {Spieler} from '@models/Spieler';
import {Cell} from '@models/game';

export interface GameSave {
  player: Spieler;
  placements: Cell[][];
  moves: Zug[];
}
