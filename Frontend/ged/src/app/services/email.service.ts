import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:91/api/emails'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, body: string): Observable<void> {
    const emailData = { to, subject, body };
    return this.http.post<void>(`${this.apiUrl}`, emailData);
  }
}
