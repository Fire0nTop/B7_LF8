import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhpMailServiceService {

  readonly EMAIL_ENDPOINT = environment.apiUrl + environment.dbUrl;

  async sendEmail(email: string, subject: string, message: string): Promise<{ success: boolean, message: string }> {

    try {
      const response = await fetch(this.EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          subject: subject,
          message: message
        })
      });

      return await response.json();

    } catch (error) {
      console.error('Netzwerkfehler:', error);
      return {
        success: false,
        message: 'Netzwerkfehler: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler')
      };
    }
  }
}
