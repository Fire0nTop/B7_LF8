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

  getAverageRoundsPerGame(): Observable<number> {
    const query = `
    SELECT AVG(runde_max) as durchschnittliche_Rundenanzahl
    FROM (
      SELECT MAX(runde) as runde_max
      FROM zug
      GROUP BY spiel_id
    ) as runden_max;
  `;
    return this.executeQuery(query).pipe(
      map(response => this.mapper.mapToAverageRounds(response.records?.[0]))
    );
  }

  getTotalGameCount(): Observable<number> {
    const query = `SELECT COUNT(*) as spieleanzahl FROM spiel;`;
    return this.executeQuery(query).pipe(
      map(response => this.mapper.mapToTotalGames(response.records?.[0]))
    );
  }

  getFirstHitShipStats(): Observable<{ schiffId: number, schiffName: string, avgRundeErsterTreffer: number }> {
    const query = `
    SELECT sch.schiff_id, sch.schiff_name, AVG(first_hit_round) AS avg_runde_erster_treffer
    FROM (
      SELECT sp.schiff_id, sp.spiel_id, MIN(z.runde) AS first_hit_round
      FROM zug z
      JOIN schiff_position sp
        ON z.spiel_id = sp.spiel_id
        AND z.kordinate_x = sp.position_x
        AND z.kordinate_y = sp.position_y
        AND z.spieler_id != sp.spieler_id -- Nur gegnerische Schiffe treffen
      WHERE z.treffer = 1
      GROUP BY sp.schiff_id, sp.spiel_id
    ) AS first_hits
    JOIN schiff sch ON sch.schiff_id = first_hits.schiff_id
    GROUP BY sch.schiff_id, sch.schiff_name
    ORDER BY avg_runde_erster_treffer ASC
    LIMIT 1;
  `;
    return this.executeQuery(query).pipe(
      map(response => this.mapper.mapToFirstHitShip(response.records?.[0]))
    );
  }

  getLongestHitCombos(): Observable<{ playerName: string, longestCombo: number }[]> {
    const query = `
    WITH HitSequences AS (
      SELECT
          z.spieler_id,
          z.spiel_id,
          z.runde,
          z.treffer,
          LAG(z.runde) OVER (PARTITION BY z.spieler_id, z.spiel_id ORDER BY z.runde) AS prev_round,
          LAG(z.treffer) OVER (PARTITION BY z.spieler_id, z.spiel_id ORDER BY z.runde) AS prev_hit
      FROM zug z
    ),
    ComboGroups AS (
      SELECT
          *,
          SUM(CASE WHEN runde = prev_round + 1 AND treffer = 1 AND prev_hit = 1 THEN 0 ELSE 1 END)
              OVER (PARTITION BY spieler_id, spiel_id ORDER BY runde) AS combo_group
      FROM HitSequences
      WHERE treffer = 1
    ),
    ComboLengths AS (
      SELECT
          spieler_id,
          spiel_id,
          combo_group,
          COUNT(*) AS combo_length,
          ROW_NUMBER() OVER (PARTITION BY spieler_id ORDER BY COUNT(*) DESC) AS \`rank\`
      FROM ComboGroups
      GROUP BY spieler_id, spiel_id, combo_group
    )
    SELECT
        s.user_name AS player_name,
        COALESCE(MAX(cl.combo_length), 0) AS longest_combo
    FROM spieler s
    LEFT JOIN ComboLengths cl ON s.spieler_id = cl.spieler_id AND cl.\`rank\` = 1
    GROUP BY s.spieler_id, s.user_name
    ORDER BY longest_combo DESC;
  `;
    return this.executeQuery(query).pipe(
      map(response => response.records?.map(this.mapper.mapToLongestCombo) || [])
    );
  }
}
