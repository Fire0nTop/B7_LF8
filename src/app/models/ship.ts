export class Ship {
  shipId: number;
  shipName: string;
  horizontalSize: number;
  verticalSize: number;
  shipCount: number;

  constructor(shipId: number, shipName: string, horizontalSize: number, verticalSize: number, shipCount: number) {
    this.shipId = shipId;
    this.shipName = shipName;
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;
    this.shipCount = shipCount;
  }
}
