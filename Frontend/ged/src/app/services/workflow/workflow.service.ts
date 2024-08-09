import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workflow } from '../models/Workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'http://localhost:91/api/workflows'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getWorkflowByDocumentId(documentId: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/document/${documentId}`);
  }
}
