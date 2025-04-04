import {Component, Input, OnInit, signal} from '@angular/core';
import {GameService} from '@services/game-service/game.service';
import {CellStatus} from '@models/game/cellSatus';
import {Ship} from '@models/ship';

@Component({
  selector: 'app-game-cell',
  imports: [],
  templateUrl: './game-cell.component.html'
})
export class GameCellComponent implements OnInit {

  @Input() X!: number;
  @Input() Y!: number;

  public readonly content = signal<Ship | null>(null)
  public readonly status = signal<CellStatus>(CellStatus.empty)
  public readonly placedShipId = signal<number|null>(null)

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.board.board.subscribe(board => {
      this.content.set(board[this.X][this.Y].content)
      this.status.set(board[this.X][this.Y].status)
      this.placedShipId.set(board[this.X][this.Y].placedShipId)
    })
  }

  onPress() {
    const ship = this.gameService.selectedShip();
    if (ship) {
      this.gameService.board.placeShip(ship,this.X,this.Y,this.gameService.selectedRotation())
    }
  }

  protected readonly CellStatus = CellStatus;
}
