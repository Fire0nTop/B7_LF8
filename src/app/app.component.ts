import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SqlTesterComponent} from './components/pages/sql-tester/sql-tester.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SqlTesterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'B7LF8';
}
