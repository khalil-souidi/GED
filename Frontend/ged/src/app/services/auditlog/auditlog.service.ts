import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from '../../models/AuditLog.model';
import { Users } from '../../models/Users.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'http://localhost:91/api/audit-logs'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  logAction(action: string, entity: string, entityId: number, details: string, user: Users): Observable<AuditLog> {
    const auditLog = { action, entity, entityId, details, user };
    return this.http.post<AuditLog>(`${this.apiUrl}`, auditLog);
  }
}
