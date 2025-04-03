import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StartConnectionComponent} from '@components/connection/start-connection/start-connection.component';
import {SqlTesterComponent} from '@components/pages/sql-tester/sql-tester.component';
import {
  TestDatabaseServiceComponent
} from '@components/connection/test-database-service/test-database-service.component';


export const routes: Routes = [
  { path: '', component: TestDatabaseServiceComponent },
  { path: 'sql-tester', component: SqlTesterComponent },
  { path: 'start-connection', component: StartConnectionComponent },
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
