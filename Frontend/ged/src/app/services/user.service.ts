import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../models/Users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:91/api/users'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/email/${email}`);
  }

  saveUser(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}`, user);
  }
}
