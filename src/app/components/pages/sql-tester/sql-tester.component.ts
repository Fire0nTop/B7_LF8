// sql-tester.component.ts
import { Component } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe, NgIf} from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sql-tester',
  templateUrl: './sql-tester.component.html',
  imports: [
    HttpClientModule,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    JsonPipe
  ]
})
export class SqlTesterComponent {
  queryForm: FormGroup;
  response: string = 'Results will appear here...';
  error: string = '';
  isLoading: boolean = false;
  readonly PHP_ENDPOINT = environment.apiUrl + environment.dbUrl;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.queryForm = this.fb.group({
      query: ['']
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.error = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('query', this.queryForm.value.query);

    this.http.post(this.PHP_ENDPOINT, body.toString(), { headers })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.error) {
            this.error = res.error;
          } else {
            this.response = res;
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('HTTP Error:', err);
          this.error = err.message || 'An unknown error occurred';
        }
      });
  }



  clearQuery() {
    this.queryForm.reset({ query: '' });
    this.response = 'Results will appear here...';
    this.error = '';
  }

  loadExample(exampleType: string) {
    let query = '';

    switch (exampleType) {
      case 'getShips':
        query = 'SELECT * FROM schiff;';
        break;
      case 'getGames':
        query = 'SELECT * FROM spiel WHERE beendet = 0 ORDER BY spiel_id DESC;';
        break;
      case 'getHits':
        query = 'SELECT * FROM zug WHERE spiel_id = 1 AND treffer = 1 ORDER BY runde;';
        break;
      case 'createShip':
        query = `INSERT INTO schiff (schiff_name, horizontal_groesse, vertikal_groesse, schiff_anzahl)
VALUES ('Kreuzer', 3, 1, 2);`;
        break;
      case 'createGame':
        query = 'INSERT INTO spiel (spiel_id, startzeit) VALUES (1, CURRENT_TIMESTAMP);';
        break;
      case 'recordHit':
        query = `INSERT INTO zug (kordinate_x, kordinate_y, treffer, runde, spieler, spiel_id)
VALUES (5, 3, 1, 1, 1, 1);`;
        break;
      default:
        query = '';
    }

    this.queryForm.get('query')?.setValue(query);
  }
}
