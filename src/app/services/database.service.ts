import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Schiff, SchiffPosition, Spiel, Zug, Spieler } from '../models/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapperService } from '@services/mapper-service/mapper.service';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private readonly PHP_ENDPOINT = `${environment.apiUrl}${environment.dbUrl}`;

  constructor(private http: HttpClient, private mapper: MapperService) { }

  private executeQuery(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('query', query);

    return this.http.post(this.PHP_ENDPOINT, body.toString(), { headers }).pipe(
      catchError(error => {
        console.error('HTTP Error:', error);
        return throwError(() => 'Database request failed');
      })
    );
  }

  // Schiff-Methoden
  getAllSchiffe(): Observable<Schiff[]> {
    return this.executeQuery('SELECT * FROM schiff;').pipe(
      map((response: any[]) => response.map(this.mapper.mapToSchiff))
    );
  }

  getSchiffById(id: number): Observable<Schiff> {
    return this.executeQuery(`SELECT * FROM schiff WHERE schiff_id = ${id}`).pipe(
      map(response => this.mapper.mapToSchiff(response[0]))
    );
  }

  createSchiff(schiff: Schiff): Observable<Schiff> {
    const query = `
      INSERT INTO schiff
        (schiff_name, horizontal_groesse, vertikal_groesse, schiff_anzahl)
      VALUES (
        '${schiff.schiffName}',
        ${schiff.horizontalGroesse},
        ${schiff.vertikalGroesse},
        ${schiff.schiffAnzahl}
      ) RETURNING *;`;

    return this.executeQuery(query).pipe(
      map(response => this.mapper.mapToSchiff(response[0]))
    );
  }

  // Spiel-Methoden
  createSpiel(spiel: Spiel): Observable<Spiel> {
    return this.executeQuery(`
      INSERT INTO spiel (startzeit)
      VALUES (CURRENT_TIMESTAMP)
      RETURNING *;
    `).pipe(
      map(response => this.mapper.mapToSpiel(response[0]))
    );
  }

  getAktivesSpiel(): Observable<Spiel> {
    return this.executeQuery(`
      SELECT * FROM spiel
      WHERE beendet = false
      ORDER BY spiel_id DESC
      LIMIT 1;
    `).pipe(
      map(response => this.mapper.mapToSpiel(response[0]))
    );
  }

  // SchiffPosition-Methoden
  setzeSchiffPosition(position: SchiffPosition): Observable<SchiffPosition> {
    const query = `
      INSERT INTO schiff_position
        (schiff_id, spiel_id, position_x, position_y)
      VALUES (
        ${position.schiffId},
        ${position.spielId},
        ${position.positionX},
        ${position.positionY}
      ) RETURNING *;`;

    return this.executeQuery(query).pipe(
      map(response => this.mapper.mapToSchiffPosition(response[0]))
    );
  }

  getSchiffPositionen(spielId: number): Observable<SchiffPosition[]> {
    return this.executeQuery(`
      SELECT * FROM schiff_position
      WHERE spiel_id = ${spielId};
    `).pipe(
      map((response: any[]) => response.map(this.mapper.mapToSchiffPosition))
    );
  }

  // Zug-Methoden
  speichereZug(zug: Zug): Observable<Zug> {
    const query = `
      INSERT INTO zug
        (kordinate_x, kordinate_y, treffer, runde, spieler, spiel_id)
      VALUES (
               ${zug.kordinateX},
               ${zug.kordinateY},
               ${zug.treffer ? 1 : 0},
               ${zug.runde},
               ${zug.spielerId},
               ${zug.spielId}
             ) RETURNING *;`;

    return this.executeQuery(query).pipe(
      map(response => this.mapper.mapToZug(response[0]))
    );
  }

  getZuegeFuerSpiel(spielId: number): Observable<Zug[]> {
    return this.executeQuery(`
      SELECT * FROM zug
      WHERE spiel_id = ${spielId}
      ORDER BY runde;
    `).pipe(
      map((response: any[]) => response.map(this.mapper.mapToZug))
    );
  }

  // Spieler-Methoden
  registriereSpieler(spieler: Spieler): Observable<Spieler> {
    return this.executeQuery(`
      INSERT INTO spieler (user_name)
      VALUES ('${spieler.userName}')
      RETURNING *;
    `).pipe(
      map(response => this.mapper.mapToSpieler(response[0]))
    );
  }

  // Hilfsmethoden
  markiereSchiffAlsZerstoert(positionId: number): Observable<SchiffPosition> {
    return this.executeQuery(`
      UPDATE schiff_position
      SET zerstört = true
      WHERE schiff_position_id = ${positionId}
      RETURNING *;
    `).pipe(
      map(response => this.mapper.mapToSchiffPosition(response[0]))
    );
  }

}
