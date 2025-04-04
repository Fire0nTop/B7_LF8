import {Attack, AttackResult} from '.';
import {Ship} from '@models/ship';

export interface AttackResponse {
  attack: Attack,
  attackResult: AttackResult,
  destroyedShip: Ship | null,
  destroyedShipPositions: Attack[] | null,
}
