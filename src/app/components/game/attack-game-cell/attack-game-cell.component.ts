import { Component, Input, signal } from '@angular/core';
import { ConnectionService } from '@services/connection-serivce/connection.service';
import {Attack, AttackResult} from '@models/connection';
import { Ship } from '@models/ship';
import { GameService } from '@services/game-service/game.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {CellStatus} from '@models/game/cellSatus';

@Component({
  selector: 'app-attack-game-cell',
  templateUrl: './attack-game-cell.component.html',
  standalone: true
})
export class AttackGameCellComponent {

  @Input({ required: true }) X!: number;
  @Input({ required: true }) Y!: number;

  public readonly attacked = signal(false);
  public readonly result = signal<AttackResult | null>(null);
  public readonly destroyedShip = signal<Ship | null>(null);

  constructor(
    public connectionService: ConnectionService,
    public gameService: GameService,
  ) {
    toObservable(gameService.destroyedShips).subscribe(value => {
      const attackCell = value.get(gameService.coordsKeyFromAttack({x:this.X, y:this.Y}))
      if (attackCell != null) {
        this.attacked.set(true);
        this.result.set(attackCell.attackResult);
        this.destroyedShip.set(attackCell.destroyedShip);
      }
    })
  }

  onPress() {
    if (!this.attacked() && this.gameService.isAttacking() && this.gameService.round() > 0) {
      this.connectionService.sendAttack({x: this.X, y: this.Y}).then(r => this.attacked.set(true))
    }
  }

  protected readonly CellStatus = CellStatus;
}
