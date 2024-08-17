import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/Users.model';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:91/api/departments/users'; // API base URL

  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getUserById(id: number): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getUserByEmail(email: string): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/email/${email}`, { headers: this.getHeaders() });
  }

  saveUser(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}`, user, { headers: this.getHeaders() });
  }
}
