class SchiffPosition {
  schiffPositionId: number;
  schiffId: number;
  spielId: number;
  positionX: number;
  positionY: number;
  zerstört: boolean;

  constructor(schiffPositionId: number, schiffId: number, spielId: number, positionX: number, positionY: number, zerstört: boolean) {
    this.schiffPositionId = schiffPositionId;
    this.schiffId = schiffId;
    this.spielId = spielId;
    this.positionX = positionX;
    this.positionY = positionY;
    this.zerstört = zerstört;
  }
}
