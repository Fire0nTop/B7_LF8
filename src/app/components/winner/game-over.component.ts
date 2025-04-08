// winner.component.ts
import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GameService} from '@services/game-service/game.service';

@Component({
  selector: 'app-winner',
  imports: [
    RouterLink
  ],
  templateUrl: 'game-over.component.html',
})
export class GameOverComponent {
  constructor(public gameService: GameService) {}
}
