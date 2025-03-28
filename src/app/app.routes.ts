import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from './components/game/game.component';
import {LandigPageComponent} from './components/pages/landig-page/landig-page.component';


export const routes: Routes = [
  { path: 'landing', component: LandigPageComponent},
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
