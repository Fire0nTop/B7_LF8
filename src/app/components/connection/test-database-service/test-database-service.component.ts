import {Component, signal} from '@angular/core';
import {DatabaseService} from '@services/database-service/database.service';
import {Ship} from '@models/ship';
import {Spiel} from '@models/Spiel';
import {SchiffPosition} from '@models/SchiffPosition';
import {JsonPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Zug} from '@models/Zug';
import {Spieler} from '@models/Spieler';

@Component({
  selector: 'app-test-database-service',
  imports: [JsonPipe, FormsModule, NgIf],
  templateUrl: './test-database-service.component.html'
})
export class TestDatabaseServiceComponent {
  allShips = signal<Ship[] | null>(null);
  ship = signal<Ship | null>(null);
  createdShip = signal<Ship | null>(null); // Newly added
  spiel = signal<Spiel | null>(null);
  aktivesSpiel = signal<Spiel | null>(null);
  schiffPositionen = signal<SchiffPosition[] | null>(null);
  shipPosition = signal<SchiffPosition | null>(null); // Newly added
  zug = signal<Zug | null>(null);
  spieler = signal<Spieler | null>(null);

  // Input Variablen
  shipId: number | null = null;
  spielId: number | null = null;
  shipName = '';
  horizontalSize: number | null = null;
  verticalSize: number | null = null;
  shipCount: number | null = null;
  spielerName = '';
  kordinateX: number | null = null;
  kordinateY: number | null = null;
  treffer: boolean = false;
  runde: number | null = null;
  spielerId: number | null = null;

  // Schiff-Position setzen
  positionSchiffId: number | null = null;
  positionSpielId: number | null = null;
  positionX: number | null = null;
  positionY: number | null = null;

  constructor(private databaseService: DatabaseService) {
  }

  getAllSchiffe() {
    this.databaseService.getAllShips().subscribe(data => this.allShips.set(data));
  }

  getSchiffById() {
    if (this.shipId !== null) {
      this.databaseService.getShipById(this.shipId).subscribe(data => this.ship.set(data));
    }
  }

  createSchiff() {
    if (this.shipName && this.horizontalSize !== null && this.verticalSize !== null && this.shipCount !== null) {
      const newShip: Ship = {
        shipName: this.shipName,
        horizontalSize: this.horizontalSize,
        verticalSize: this.verticalSize,
        shipCount: this.shipCount
      } as Ship;
      this.databaseService.createShip(newShip).subscribe(data => this.createdShip.set(data));
    }
  }

  createSpiel() {
    this.databaseService.createGame().subscribe(data => this.spiel.set(data));
  }

  getSchiffPositionen() {
    if (this.spielId !== null) {
      this.databaseService.getShipPositionsByGameId(this.spielId).subscribe(data => this.schiffPositionen.set(data));
    }
  }

  registriereSpieler() {
    if (this.spielerName) {
      const spieler: Spieler = {userName: this.spielerName} as Spieler;
      this.databaseService.registerPlayer(spieler).subscribe(data => this.spieler.set(data));
    }
  }

  speichereZug() {
    if (this.kordinateX !== null && this.kordinateY !== null && this.runde !== null && this.spielerId !== null && this.spielId !== null) {
      const zug: Zug = {
        kordinateX: this.kordinateX,
        kordinateY: this.kordinateY,
        treffer: this.treffer,
        runde: this.runde,
        spielerId: this.spielerId,
        spielId: this.spielId
      } as Zug;
      this.databaseService.saveMove(zug).subscribe(data => this.zug.set(data));
    }
  }

  setzeSchiffPosition() {
    if (this.positionSchiffId !== null && this.positionSpielId !== null && this.positionX !== null && this.positionY !== null) {
      const position: SchiffPosition = {
        schiffId: this.positionSchiffId,
        spielId: this.positionSpielId,
        positionX: this.positionX,
        positionY: this.positionY
      } as SchiffPosition;

      this.databaseService.setShipPosition(position).subscribe(data => this.shipPosition.set(data));
    }
  }
}
