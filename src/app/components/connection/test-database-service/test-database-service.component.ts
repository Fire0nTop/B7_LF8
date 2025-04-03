import { Component } from '@angular/core';
import {DatabaseService} from '@services/database.service';
import {Ship} from '@models/ship';
import {Spiel} from '@models/Spiel';
import {SchiffPosition} from '@models/SchiffPosition';
import {JsonPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Zug} from '@models/Zug';
import {Spieler} from '@models/Spieler';

@Component({
  selector: 'app-test-database-service',
  imports: [
    JsonPipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './test-database-service.component.html'
})
export class TestDatabaseServiceComponent {
  allShips: Ship[] | null = null;
  ship: Ship | null = null;
  spiel: Spiel | null = null;
  aktivesSpiel: Spiel | null = null;
  schiffPositionen: SchiffPosition[] | null = null;
  zug: Zug | null = null;
  spieler: Spieler | null = null;

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

  constructor(private databaseService: DatabaseService) {}

  getAllSchiffe() {
    this.databaseService.getAllSchiffe().subscribe(data => this.allShips = data);
  }

  getSchiffById() {
    if (this.shipId !== null) {
      this.databaseService.getSchiffById(this.shipId).subscribe(data => this.ship = data);
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
      this.databaseService.createSchiff(newShip).subscribe(data => this.ship = data);
    }
  }

  createSpiel() {
    this.databaseService.createSpiel({} as Spiel).subscribe(data => this.spiel = data);
  }

  getAktivesSpiel() {
    this.databaseService.getAktivesSpiel().subscribe(data => this.aktivesSpiel = data);
  }

  getSchiffPositionen() {
    if (this.spielId !== null) {
      this.databaseService.getSchiffPositionen(this.spielId).subscribe(data => this.schiffPositionen = data);
    }
  }

  registriereSpieler() {
    if (this.spielerName) {
      const spieler: Spieler = { userName: this.spielerName } as Spieler;
      this.databaseService.registriereSpieler(spieler).subscribe(data => this.spieler = data);
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
      this.databaseService.speichereZug(zug).subscribe(data => this.zug = data);
    }
  }
}
