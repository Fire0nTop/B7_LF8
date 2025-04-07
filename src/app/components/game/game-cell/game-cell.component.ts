import {Component, Input, OnInit, signal} from '@angular/core';
import {GameService} from '@services/game-service/game.service';

import {Ship} from '@models/ship';
import { CellStatus } from '@models/game/cellSatus';

@Component({
  selector: 'app-game-cell',
  templateUrl: './game-cell.component.html'
})
export class GameCellComponent implements OnInit {
  @Input() X!: number;
  @Input() Y!: number;

  public readonly content = signal<Ship | null>(null);
  public readonly status = signal<CellStatus>(CellStatus.empty);
  public readonly placedShipId = signal<number|null>(null);
  public readonly shipImagePath = signal<string>('');
  public readonly isShip = signal<boolean>(false);
  public readonly isHorizontal = signal<boolean>(false);

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.board.board.subscribe(board => {
      const cell = board[this.X][this.Y];
      this.content.set(cell.content);
      this.status.set(cell.status);
      this.placedShipId.set(cell.placedShipId);

      if (cell.content) {
        this.isShip.set(true);
        this.isHorizontal.set(this.determineShipOrientation(cell.content));
        this.shipImagePath.set(this.getShipImagePath(cell.content));
      } else {
        this.isShip.set(false);
        this.shipImagePath.set('');
      }
    });
  }

  private determineShipOrientation(ship: Ship): boolean {
    // Assuming orientation can be determined by comparing sizes
    return ship.horizontalSize > ship.verticalSize;
  }

  private getShipImagePath(ship: Ship): string {
    const orientation = this.isHorizontal() ? 'h' : 'v';
    const size = this.isHorizontal() ? ship.horizontalSize : ship.verticalSize;

    // Example path: assets/ships/carrier-h.png
    return `game/tom/ship-${ship.horizontalSize.toString()}-${orientation}.png`;

    // Alternative if you have size-based images:
    // return `assets/ships/ship-${size}-${orientation}.png`;
  }

  onPress() {
    const ship = this.gameService.selectedShip();
    if (ship) {
      if (this.gameService.isRemoving()) {
        this.gameService.board.removeShip(this.X, this.Y);
      } else {
        this.gameService.board.placeShip(
          ship,
          this.X,
          this.Y,
          this.gameService.selectedRotation()
        );
      }
    }
  }

  protected readonly CellStatus = CellStatus;
}
