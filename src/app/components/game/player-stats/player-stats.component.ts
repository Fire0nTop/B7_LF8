import {Component, input} from '@angular/core';

@Component({
  selector: 'app-player-stats',
  imports: [],
  templateUrl: './player-stats.component.html'
})
export class PlayerStatsComponent {
  left = input.required<boolean>()
  other = input.required<boolean>()
  constructor() {
  }
}
