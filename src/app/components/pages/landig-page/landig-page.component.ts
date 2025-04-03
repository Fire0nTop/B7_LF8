import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '@services/game-service/game.service';

@Component({
  selector: 'app-landig-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './landig-page.component.html',
  styleUrls: ['./landig-page.component.scss']
})
export class LandigPageComponent {
  constructor(
    private router: Router,
    private gameService: GameService
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      //this.gameService.setPlayerName(form.value.username); TODO: fix this
      this.router.navigate(['/start-connection']); // Korrigierte Navigation
    }
  }

  onSubmitSQL() {
    this.router.navigate(['/sql-tester']); // Korrigierte Navigation
  }
}
