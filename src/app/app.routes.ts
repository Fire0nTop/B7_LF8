import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartConnectionComponent} from '@components/connection/start-connection/start-connection.component';
import {GameComponent} from '@components/game/game.component';


export const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'start-connection', component: StartConnectionComponent },
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
