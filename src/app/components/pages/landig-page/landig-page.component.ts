import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {GameService} from '../../../services/game-service/game-service.service';

@Component({
  selector: 'app-landig-page',
  imports: [
    FormsModule
  ],
  templateUrl: './landig-page.component.html'
})

export class LandigPageComponent {
  constructor(
    private router: Router,
    private gameService: GameService
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.gameService.setPlayerName(form.value.username);
      this.router.navigate(['/game']);
    }
  }

  protected readonly name = name;
}

