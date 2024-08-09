import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departement } from 'src/app/models/Departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:91/api/departments'; // API base URL

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}`);
  }

  getDepartmentById(id: number): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/${id}`);
  }

  getDepartmentByName(name: string): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/name/${name}`);
  }

  saveDepartment(department: Departement): Observable<Departement> {
    return this.http.post<Departement>(`${this.apiUrl}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
