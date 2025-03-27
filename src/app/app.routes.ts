import { Routes } from '@angular/router';
import {StartPageComponent} from './components/Pages/Startpage/startPage.component';

export const routes: Routes = [
  { path: 'home', component: StartPageComponent },
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: '**', component: StartPageComponent }
];
