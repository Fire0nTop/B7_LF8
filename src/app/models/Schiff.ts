export class Schiff {
  schiffId: number;
  schiffName: string;
  horizontalGroesse: number;
  vertikalGroesse: number;
  schiffAnzahl: number;

  constructor(schiffId: number, schiffName: string, horizontalGroesse: number, vertikalGroesse: number, schiffAnzahl: number) {
    this.schiffId = schiffId;
    this.schiffName = schiffName;
    this.horizontalGroesse = horizontalGroesse;
    this.vertikalGroesse = vertikalGroesse;
    this.schiffAnzahl = schiffAnzahl;
  }
}
