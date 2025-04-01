import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandigPageComponent} from '@components/pages/landig-page/landig-page.component';
import {StartConnectionComponent} from '@components/connection/start-connection/start-connection.component';


export const routes: Routes = [
  { path: '', component: LandigPageComponent },
  { path: 'start-connection', component: StartConnectionComponent },
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
