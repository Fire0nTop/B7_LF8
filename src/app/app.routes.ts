import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartConnectionComponent} from '@components/connection/start-connection/start-connection.component';
import {SqlTesterComponent} from '@components/pages/sql-tester/sql-tester.component';
import {
  TestConnectionServiceComponent
} from '@components/connection/test-connection-service/test-connection-service.component';
import {PhpConnectionComponent} from '@components/connection/php-connection/php-connection.component';
import {GameComponent} from '@components/game/game.component';
import {GameOverComponent} from '@components/pages/game-over/game-over.component';
import {StatisticsPageComponent} from '@components/pages/statistics-page/statistics-page.component';



export const routes: Routes = [

  { path: '', component: StartConnectionComponent },
  { path: 'sql', component: SqlTesterComponent },
  { path: 'sql-tester', component: PhpConnectionComponent },
  { path: 'gamecomponent', component: GameComponent },
  { path: 'connect', component: TestConnectionServiceComponent },
  { path: 'gameOver', component: GameOverComponent },
  { path: 'statistics', component: StatisticsPageComponent },
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
