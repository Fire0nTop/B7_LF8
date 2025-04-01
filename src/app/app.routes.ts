import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartConnectionComponent} from '@components/connection/start-connection/start-connection.component';
import {GameComponent} from '@components/game/game.component';
import {PhpConnectionComponent} from '@components/connection/php-connection/php-connection.component';


export const routes: Routes = [
  { path: '', component: PhpConnectionComponent },
  { path: 'start-connection', component: StartConnectionComponent },
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
