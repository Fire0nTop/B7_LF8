import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {JsonPipe, NgIf} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-php-connection',
  imports: [
    HttpClientModule, // add this import!
    JsonPipe,
    ReactiveFormsModule,
    NgIf
  ],
  template: `
    <div class="text-primary">
      <form [formGroup]="queryForm" (ngSubmit)="onSubmit()">
        <textarea formControlName="query" placeholder="Enter SQL query"></textarea>
        <button type="submit" [disabled]="isLoading">
          {{ isLoading ? 'Executing...' : 'Execute Query' }}
        </button>
      </form>
      <div *ngIf="response">
        <h3>Result:</h3>
        <pre *ngIf="response.status === 'success'">
          <div *ngIf="response.records">
            Records: {{ response.records | json }}
          </div>
          <div *ngIf="response.affected_rows">
            Affected rows: {{ response.affected_rows }}
          </div>
          <div *ngIf="response.inserted_id">
            Inserted ID: {{ response.inserted_id }}
          </div>
        </pre>
        <pre *ngIf="response.error">
          Error: {{ response.error }}
        </pre>
      </div>
      <div *ngIf="error">
        {{ error }}
      </div>
    </div>
  `
})
export class PhpConnectionComponent {
  queryForm: FormGroup;
  response: any;
  error = '';
  isLoading = false;

  readonly PHP_ENDPOINT = environment.apiUrl + environment.dbUrl;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.queryForm = this.fb.group({
      query: [''] // Removed all validators
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.error = '';
    this.response = null;

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
}
