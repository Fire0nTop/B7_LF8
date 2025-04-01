import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schiff, SchiffPosition, Spiel, Zug, Spieler } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = environment.apiUrl;

  constructor() { }

  private async executeFetch(query: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('query', query);

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  executeQuery(query: string): Observable<any> {
    return new Observable(observer => {
      this.executeFetch(query)
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Schiff-Methoden
  getAllSchiffe(): Observable<any> {
    return this.executeQuery('SELECT * FROM schiff;');
  }

  getSchiffById(id: number): Observable<any> {
    return this.executeQuery(`SELECT * FROM schiff WHERE schiff_id = ${id};`);
  }

  createSchiff(schiff: Schiff): Observable<any> {
    const query = `
      INSERT INTO schiff
        (schiff_name, horizontal_groesse, vertikal_groesse, schiff_anzahl)
      VALUES (
                 '${schiff.schiffName}',
                 ${schiff.horizontalGroesse},
                 ${schiff.vertikalGroesse},
                 ${schiff.schiffAnzahl}
             );`;
    return this.executeQuery(query);
  }

  // Spiel-Methoden
  createSpiel(spiel: Spiel): Observable<any> {
    return this.executeQuery(`INSERT INTO spiel (spiel_id) VALUES (${spiel.spielId});`);
  }

  getAktivesSpiel(): Observable<any> {
    return this.executeQuery('SELECT * FROM spiel ORDER BY spiel_id DESC LIMIT 1;');
  }

  // SchiffPosition-Methoden
  setzeSchiffPosition(position: SchiffPosition): Observable<any> {
    const query = `
      INSERT INTO schiff_position
        (schiff_id, spiel_id, position_x, position_y, zerstört)
      VALUES (
               ${position.schiffId},
               ${position.spielId},
               ${position.positionX},
               ${position.positionY},
               ${position.zerstört ? 1 : 0}
             );`;
    return this.executeQuery(query);
  }

  getSchiffPositionen(spielId: number): Observable<any> {
    return this.executeQuery(`SELECT * FROM schiff_position WHERE spiel_id = ${spielId};`);
  }

  // Zug-Methoden
  speichereZug(zug: Zug): Observable<any> {
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
             );`;
    return this.executeQuery(query);
  }

  getZuegeFuerSpiel(spielId: number): Observable<any> {
    return this.executeQuery(`SELECT * FROM zug WHERE spiel_id = ${spielId} ORDER BY runde;`);
  }

  // Spieler-Methoden
  registriereSpieler(spieler: Spieler): Observable<any> {
    return this.executeQuery(
      `INSERT INTO spieler (spieler_id, user_name) VALUES (${spieler.spielerId}, '${spieler.userName}');`
    );
  }

  // Weitere Hilfsmethoden
  markiereSchiffAlsZerstoert(positionId: number): Observable<any> {
    return this.executeQuery(
      `UPDATE schiff_position SET zerstört = 1 WHERE schiff_position_id = ${positionId};`
    );
  }

  getSpielstand(spielId: number): Observable<any> {
    return this.executeQuery(`
      SELECT
        s.spiel_id,
        (SELECT COUNT(*) FROM zug WHERE spiel_id = ${spielId} AND treffer = 1) as treffer,
        (SELECT COUNT(*) FROM schiff_position WHERE spiel_id = ${spielId} AND zerstört = 1) as zerstörte_schiffe
      FROM spiel s
      WHERE s.spiel_id = ${spielId};
    `);
  }
}
