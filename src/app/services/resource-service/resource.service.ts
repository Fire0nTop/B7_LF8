import {Injectable} from '@angular/core';
import {Cell, Rotation} from '@models/game';
import {GameService} from '@services/game-service/game.service';
import {Ship} from '@models/ship';
import {Attack} from '@models/connection';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  public readonly RESOURCE_PATH = "game-resources"
  public readonly PACK_NAME = "tom"

  constructor(private gameService: GameService) { }

  public getShipImgSourceForCell(positions:Attack[],ship:Ship,position:Attack): string {

    if (positions.length === 0) return ''

    const topLeft = positions.reduce((closest, current) => {
      const currentDist = current.x ** 2 + current.y ** 2;
      const closestDist = closest.x ** 2 + closest.y ** 2;
      return currentDist < closestDist ? current : closest;
    });

    if (position.x == topLeft.x && position.y == topLeft.y) {
      console.log("positions",positions)
      const rotation = this.gameService.board.getRotationOfCoords(positions)
      console.log("rotation",rotation != null ? Rotation[rotation] : null)
      if (rotation != null) {
        return this.buildShipSource(ship,rotation)
      }
    }
    return ''
  }

  public getShipImgSource(ship:Ship) {
    return this.buildShipSource(ship,Rotation.horizontal)
  }

  private buildShipSource(ship:Ship,rotation:Rotation) {
    const size = (ship.verticalSize * ship.horizontalSize).toString()
    const direction = (rotation === Rotation.horizontal ? 'h' : 'v')
    console.log(direction)
    return `${this.RESOURCE_PATH}/${this.PACK_NAME}/ship-${size}-${direction}.png`
  }

  public getWaterImgSource() {
    return `${this.RESOURCE_PATH}/${this.PACK_NAME}/water.gif`
  }

  public getHitImgSource() {
    return `${this.RESOURCE_PATH}/${this.PACK_NAME}/hit.png`
  }
}
