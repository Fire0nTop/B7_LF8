import { Injectable } from '@angular/core';
import {Ship} from '@models/ship';
import {Spiel} from '@models/Spiel';
import {SchiffPosition} from '@models/SchiffPosition';
import {Zug} from '@models/Zug';
import {Spieler} from '@models/Spieler';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  mapToSchiff(data: any): Ship {
    return {
      shipId: data.schiff_id,
      shipName: data.schiff_name,
      horizontalSize: data.horizontal_groesse,
      verticalSize: data.vertikal_groesse,
      shipCount: data.schiff_anzahl,
    };
  }

   mapToSchiffPosition(data: any): SchiffPosition {
    return {
      spielerId: data.spielerId,
      schiffPositionId: data.schiff_position_id,
      schiffId: data.schiff_id,
      spielId: data.spiel_id,
      positionX: data.position_x,
      positionY: data.position_y,
      zerstoert: data.zerstoert === 1
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

  mapToAverageRounds(data: any): number {
    return data.durchschnittliche_Rundenanzahl ?? 0;
  }

  mapToTotalGames(data: any): number {
    return data.spieleanzahl ?? 0;
  }

  mapToFirstHitShip(data: any): { schiffId: number, schiffName: string, avgRundeErsterTreffer: number } {
    return {
      schiffId: data.schiff_id,
      schiffName: data.schiff_name,
      avgRundeErsterTreffer: data.avg_runde_erster_treffer
    };
  }

  mapToLongestCombo(data: any): { playerName: string, longestCombo: number } {
    return {
      playerName: data.player_name,
      longestCombo: data.longest_combo
    };
  }
}
