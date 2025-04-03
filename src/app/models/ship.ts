export class Ship {
  shipId: number;
  shipName: string;
  horizontalSize: number;
  verticalSize: number;
  shipCount: number;

  constructor(schiffId: number, schiffName: string, horizontalGroesse: number, vertikalGroesse: number, schiffAnzahl: number) {
    this.shipId = schiffId;
    this.shipName = schiffName;
    this.horizontalSize = horizontalGroesse;
    this.verticalSize = vertikalGroesse;
    this.shipCount = schiffAnzahl;
  }
}
