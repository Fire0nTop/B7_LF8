import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '@services/game-service/game.service';
import {ConnectionService} from '@services/connection-serivce/connection.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-game-over',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: 'game-over.component.html',
})
export class GameOverComponent {
  userEmail = '';
  constructor(public gameService: GameService,public connectionService: ConnectionService,public router: Router) {}

  navigateToStart() {
    this.router.navigate(['/']);
  }
}
