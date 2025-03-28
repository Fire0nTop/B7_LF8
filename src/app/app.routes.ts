import { Routes } from '@angular/router';
import {ConnectionPageComponent} from './components/pages/connection-page/connection-page.component';

export const routes: Routes = [
  { path: '', component: ConnectionPageComponent},
  { path: '**', redirectTo: '/404'}
];
