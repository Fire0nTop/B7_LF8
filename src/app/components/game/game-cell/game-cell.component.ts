import {Component, Input, OnInit, signal} from '@angular/core';
import {GameService} from '@services/game-service/game.service';

import {Ship} from '@models/ship';
import { CellStatus } from '@models/game/cellSatus';
import {ResourceService} from '@services/resource-service/resource.service';
import {AttackResult} from '@models/connection';

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
  public readonly shipSrc = signal<string>('');

  constructor(public gameService: GameService,public resourceService: ResourceService,) {}

  ngOnInit(): void {
    this.gameService.board.board.subscribe(board => {
      const cell = board[this.X][this.Y];
      this.content.set(cell.content);
      this.status.set(cell.status);
      this.placedShipId.set(cell.placedShipId);

      if (cell.content != null && cell.placedShipId != null) {
        this.shipSrc.set(this.resourceService.getShipImgSourceForCell(this.gameService.board.getAllPositionsOfPlaceId(cell.placedShipId),cell.content,{x: this.X, y: this.Y}));
      }
    });
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
  protected readonly AttackResult = AttackResult;
}
