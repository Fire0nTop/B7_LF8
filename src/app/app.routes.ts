import {ConnectionPageComponent} from './components/pages/connection-page/connection-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from './components/game/game.component';


export const routes: Routes = [
  { path: '', component: ConnectionPageComponent},
  { path: '**', redirectTo: '/404'},
  { path: 'game', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
