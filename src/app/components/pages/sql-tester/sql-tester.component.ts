// sql-tester.component.ts
import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'; // Pfad anpassen

@Component({
  selector: 'app-sql-tester',
  templateUrl: './sql-tester.component.html',
  styleUrls: ['./sql-tester.component.css']
})
export class SqlTesterComponent {
  currentQuery: string = '';
  queryResult: string = 'Results will appear here...';
  isLoading: boolean = false;

  constructor(private dbService: DatabaseService) {}

  executeQuery() {
    if (!this.currentQuery.trim()) return;

    this.isLoading = true;
    this.queryResult = "Executing query...";

    this.dbService.executeQuery(this.currentQuery).subscribe({
      next: (data) => this.handleQueryResult(data),
      error: (error) => this.handleError(error)
    });
  }

  private handleQueryResult(data: any) {
    if (data.error) {
      this.queryResult = `Error: ${data.error}`;
    } else {
      this.formatResults(Array.isArray(data) ? data : [data]);
    }
    this.isLoading = false;
  }

  private handleError(error: any) {
    this.queryResult = `Error: ${error.message || 'Unknown error'}`;
    this.isLoading = false;
  }

  clearQuery() {
    this.currentQuery = '';
    this.queryResult = 'Results will appear here...';
  }

  // formatResults Methode bleibt gleich wie in Ihrer Vorlage
  // clearQuery Methode bleibt gleich wie in Ihrer Vorlage

  loadExample(type: string) {
    const examples: {[key: string]: string} = {
      getAll: 'SELECT * FROM parkplatz;',
      getSingle: 'SELECT * FROM parkplatz WHERE key_id = 1;',
      updateExample: `UPDATE parkplatz SET
        reihe = 2,
        parkplatz_nummer = 5,
        status = 'frei'
        WHERE key_id = 1;`,
      insertExample: `INSERT INTO parkplatz
                        (reihe, parkplatz_nummer, status)
                      VALUES (3, 12, 'besetzt')`,
      deleteExample: 'DELETE FROM parkplatz WHERE key_id = 1;'
    };

    this.currentQuery = examples[type] || '';
  }

  private formatResults(data: any[]) {
    if (!data || data.length === 0) {
      this.queryResult = "Query executed successfully. No results returned.";
      return;
    }

    // Get all column names from first row
    const columns = Object.keys(data[0]);

    // Calculate maximum width for each column
    const columnWidths: {[key: string]: number} = {};

    columns.forEach(col => {
      // Start with column name length as minimum width
      let maxWidth = col.length;

      // Check each row's value for this column
      data.forEach(row => {
        const value = row[col] !== null && row[col] !== undefined
          ? String(row[col])
          : 'NULL';
        maxWidth = Math.max(maxWidth, value.length);
      });

      columnWidths[col] = maxWidth;
    });

    // Build header row
    let output = '';
    columns.forEach(col => {
      output += col.padEnd(columnWidths[col]) + ' | ';
    });
    output += '\n';

    // Build separator row
    columns.forEach(col => {
      output += '-'.repeat(columnWidths[col]) + '-+-';
    });
    output += '\n';

    // Build data rows
    data.forEach(row => {
      columns.forEach(col => {
        const value = row[col] !== null && row[col] !== undefined
          ? String(row[col])
          : 'NULL';
        output += value.padEnd(columnWidths[col]) + ' | ';
      });
      output += '\n';
    });

    this.queryResult = output;
  }
}
