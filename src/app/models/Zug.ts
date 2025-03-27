class Zug {
  kordinateX: number;
  kordinateY: number;
  treffer: boolean;
  runde: number;
  spielerId: number;
  spielId: number;

  constructor(kordinateX: number, kordinateY: number, treffer: boolean, runde: number, spielerId: number, spielId: number) {
    this.kordinateX = kordinateX;
    this.kordinateY = kordinateY;
    this.treffer = treffer;
    this.runde = runde;
    this.spielerId = spielerId;
    this.spielId = spielId;
  }
}
