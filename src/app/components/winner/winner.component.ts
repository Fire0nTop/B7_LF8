// winner.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-winner',
  template: `
    <div class="winner-page">
      <h1>🏆 Sieger: {{ winnerId }}</h1>
      <p>Runde: {{ round }}</p>
      <button routerLink="/">Neues Spiel</button>
    </div>
  `
})
export class WinnerComponent {
  winnerId: string;
  round: number;
  destroyedShips: any[];

  constructor(private route: ActivatedRoute) {
    this.winnerId = this.route.snapshot.paramMap.get('uuid')!;
    const navigation = window.history.state;
    this.round = navigation.round;
    this.destroyedShips = navigation.destroyedShips;
  }
}
