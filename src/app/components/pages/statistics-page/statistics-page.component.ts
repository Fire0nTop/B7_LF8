import {Component, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DatabaseService} from '@services/database-service/database.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-statistics-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './statistics-page.component.html',
})
export class StatisticsPageComponent implements OnInit {

  averageRounds = signal<number | null>(null);
  totalGames = signal<number | null>(null);
  firstHitShip = signal<{ schiffId: number, schiffName: string, avgRundeErsterTreffer: number } | null>(null);
  longestCombos = signal<{ playerName: string, longestCombo: number }[]>([]);

  constructor(public databaseService: DatabaseService,protected router:Router) {}

  public fetchData() {
    this.databaseService.getAverageRoundsPerGame().subscribe(data => {
      this.averageRounds.set(data);
    });

    this.databaseService.getTotalGameCount().subscribe(data => {
      this.totalGames.set(data);
    });

    this.databaseService.getFirstHitShipStats().subscribe(data => {
      this.firstHitShip.set(data);
    });

    this.databaseService.getLongestHitCombos().subscribe(data => {
      this.longestCombos.set(data.slice(0, 5));
    });
  }

  ngOnInit(): void {
    this.fetchData()
  }
}
