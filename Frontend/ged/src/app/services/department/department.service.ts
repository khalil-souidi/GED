import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departement } from 'src/app/models/Departement.model';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:91/api/departments'; // API base URL

  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllDepartments(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getDepartmentById(id: number): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getDepartmentByName(name: string): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/name/${name}`, { headers: this.getHeaders() });
  }

  saveDepartment(department: Departement): Observable<Departement> {
    return this.http.post<Departement>(`${this.apiUrl}`, department, { headers: this.getHeaders() });
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
