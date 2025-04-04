import { Component, Input, signal } from '@angular/core';
import { ConnectionService } from '@services/connection-serivce/connection.service';
import { AttackResult } from '@models/connection';
import { Ship } from '@models/ship';
import { GameService } from '@services/game-service/game.service';

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
    public connectionService: ConnectionService
  ) {
    connectionService.onAttackResultReceived.subscribe((data) => {
      if (data.attack.x === this.X && data.attack.y === this.Y) {
        this.attacked.set(true);
        this.result.set(data.attackResult);
        this.destroyedShip.set(data.destroyedShip);
      } else if (data.attackResult === AttackResult.Sunk) {
        if (data.destroyedShipPositions != null) {
          if (data.destroyedShipPositions.filter(position => position.x == this.X && position.y == this.Y).length >= 1) {
            this.attacked.set(true);
            this.result.set(data.attackResult);
            this.destroyedShip.set(data.destroyedShip);
          }
        }
      }
    });
  }

  onPress() {
    if (!this.attacked()) {
      this.attacked.set(true);
      this.connectionService.sendAttack({ x: this.X, y: this.Y }).then((r) =>
        this.result.set(r.attackResult)
      );
    }
  }
}
