import {Component, input} from '@angular/core';
import {ConnectionService} from '@services/connection-serivce/connection.service';
import {GameService} from '@services/game-service/game.service';
import {Ship} from '@models/ship';
import {Rotation} from '@models/game';

@Component({
  selector: 'app-player-stats',
  imports: [],
  templateUrl: './player-stats.component.html'
})
export class PlayerStatsComponent {
  left = input.required<boolean>()
  other = input.required<boolean>()
  constructor(protected connectionService: ConnectionService, protected gameService: GameService) {}

  getUuid() {
    if (this.other()) {
      return this.connectionService.connectedPeerId()
    }else {
      return this.connectionService.peerId()
    }
  }

  getUsername() {
    if (this.other()) {
      return this.connectionService.otherUsername() ? this.connectionService.otherUsername() : "Opponent"
    }else {
      return this.connectionService.username() ? this.connectionService.username() : "You"
    }
  }

  setSelectedShip(ship: Ship) {
    this.gameService.selectedShip.set(ship)
  }

  switchRotation() {
    this.gameService.selectedRotation.update(value => {
      return value === Rotation.horizontal ? Rotation.vertical : Rotation.horizontal;
    })
  }

  switchBoard() {
    this.gameService.isAttacking.update(value => {
      return !value
    })
  }
}
