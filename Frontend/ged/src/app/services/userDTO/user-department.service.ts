import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDepartmentService {

  private apiUrl = 'http://localhost:91/api/users';

  constructor(private http: HttpClient) { }
  getUserDepartment(email: string): Observable<{ id: number, email: string, departmentName: string }> { // Update type here
    return this.http.get<{ id: number, email: string, departmentName: string }>(`${this.apiUrl}/department`, {
      params: { email }
    });
  }
}
