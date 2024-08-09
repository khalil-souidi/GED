import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/Users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:91/api/departments/users'; // API base URL

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}`);
  }

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
