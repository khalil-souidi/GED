import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workflow } from 'src/app/models/Workflow.model';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'http://localhost:91/api/workflows'; // Replace with your actual API URL

  constructor(private http: HttpClient, private oauthService: OAuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getWorkflowByDocumentId(documentId: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/document/${documentId}`, { headers: this.getHeaders() });
  }
}
