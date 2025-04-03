import { Injectable } from '@angular/core';
import {Schiff} from '@models/Schiff';
import {Spiel} from '@models/Spiel';
import {SchiffPosition} from '@models/SchiffPosition';
import {Zug} from '@models/Zug';
import {Spieler} from '@models/Spieler';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() { }

  mapToSchiff(data: any): Schiff {
    return {
      schiffId: data.schiff_id,
      schiffName: data.schiff_name,
      horizontalGroesse: data.horizontal_groesse,
      vertikalGroesse: data.vertikal_groesse,
      schiffAnzahl: data.schiff_anzahl,
    };
  }

   mapToSchiffPosition(data: any): SchiffPosition {
    return {
      schiffPositionId: data.schiff_position_id,
      schiffId: data.schiff_id,
      spielId: data.spiel_id,
      positionX: data.position_x,
      positionY: data.position_y,
      zerstört: data.zerstört === 1
    };
  }


  mapToSpiel(data: any): Spiel {
    return {
      spielId: data.spiel_id,
    };
  }

   mapToZug(data: any): Zug {
    return {
      kordinateX: data.kordinate_x,
      kordinateY: data.kordinate_y,
      treffer: data.treffer === 1,
      runde: data.runde,
      spielerId: data.spieler,
      spielId: data.spiel_id
    };
  }

   mapToSpieler(data: any): Spieler {
    return {
      spielerId: data.spieler_id,
      userName: data.user_name,
    };
  }



}
