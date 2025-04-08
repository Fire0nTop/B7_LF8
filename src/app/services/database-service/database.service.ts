import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, take, tap, throwError} from 'rxjs';
import {SchiffPosition, Ship, Spieler, Zug} from '@models/index';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MapperService} from '@services/mapper-service/mapper.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient, private mapper: MapperService) {
  }

  private executeQuery(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('query', query);

    return this.http.post(environment.apiUrl + environment.dbUrl, body.toString(), {headers}).pipe(
      catchError(error => {
        console.error('HTTP Error:', error);
        return throwError(() => new Error('Database request failed'));
      })
    )
  }

  getAllShips() {
    return this.executeQuery('SELECT * FROM schiff').pipe(
      map(response => response.records?.map(this.mapper.mapToSchiff) || [])
    );
  }

  getShipById(id: number) {
    return this.executeQuery(`SELECT *
                              FROM schiff
                              WHERE schiff_id = ${id}`).pipe(
      map(response => response.records?.length ? this.mapper.mapToSchiff(response.records[0]) : null)
    );
  }

  getPlayerById(id: number) {
    return this.executeQuery(`SELECT *
                              FROM spieler
                              WHERE spieler_id = ${id}`).pipe(
      map(response => response.records?.length ? this.mapper.mapToSpieler(response.records[0]) : null)
    );
  }

  getPlayerByUsername(username: string) {
    return this.executeQuery(`SELECT *
                              FROM spieler
                              WHERE user_name = '${username}'`).pipe(
      map(response => response.records?.length ? this.mapper.mapToSpieler(response.records[0]) : null)
    );
  }

  createShip(schiff: Ship) {
    return this.executeQuery(`
      INSERT INTO schiff (schiff_name, horizontal_groesse, vertikal_groesse, schiff_anzahl)
      VALUES ('${schiff.shipName}', ${schiff.horizontalSize}, ${schiff.verticalSize}, ${schiff.shipCount});
    `).pipe(
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }

  createGame() {
    return this.executeQuery(`
      INSERT INTO spiel (startzeit)
      VALUES (CURRENT_TIMESTAMP);
    `).pipe(
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }

  setShipPosition(position: SchiffPosition) {
    return this.executeQuery(`
      INSERT INTO schiff_position (schiff_id, spiel_id, position_x, position_y)
      VALUES (${position.schiffId}, ${position.spielId}, ${position.positionX}, ${position.positionY});
    `).pipe(
      take(1),
      tap(response => {
        console.log('Response from createShip:', response); // Check if inserted_id matches
      }),
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }

  saveShipPosition(position: SchiffPosition) {
    return this.executeQuery(`
    INSERT INTO schiff_position (
      schiff_id, spiel_id, spieler_id, position_x, position_y, zerstört
    )
    VALUES (
      ${position.schiffId},
      ${position.spielId},
      ${position.spielerId},
      ${position.positionX},
      ${position.positionY},
      ${position.zerstoert ? 1 : 0}
    );
  `).pipe(
      take(1),
      tap(response => {
        console.log('Response from saveShipPosition:', response);
      }),
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }

  getShipPositionsByGameId(spielId: number) {
    return this.executeQuery(`SELECT *
                              FROM schiff_position
                              WHERE spiel_id = ${spielId};`).pipe(
      map(response => response.records?.map(this.mapper.mapToSchiffPosition) || [])
    );
  }

  saveMove(zug: Zug) {
    return this.executeQuery(`
      INSERT INTO zug (kordinate_x, kordinate_y, treffer, runde, spieler_id, spiel_id)
      VALUES (${zug.kordinateX}, ${zug.kordinateY}, ${zug.treffer ? 1 : 0}, ${zug.runde}, ${zug.spielerId},
              ${zug.spielId});
    `).pipe(
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }

  getMovesByGameId(spielId: number) {
    return this.executeQuery(`SELECT *
                              FROM zug
                              WHERE spiel_id = ${spielId}
                              ORDER BY runde;`).pipe(
      map(response => response.records?.map(this.mapper.mapToZug) || [])
    );
  }

  registerPlayer(player: Spieler) {
    return this.executeQuery(`
      INSERT INTO spieler (user_name)
      VALUES ('${player.userName}');
    `).pipe(
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }

  markShipAsDestroyed(positionId: number) {
    return this.executeQuery(`
      UPDATE schiff_position
      SET zerstört = true
      WHERE schiff_position_id = ${positionId};
    `).pipe(
      map(response => response.inserted_id ? response.inserted_id : null)
    );
  }
}
