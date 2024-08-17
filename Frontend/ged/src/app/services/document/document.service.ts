import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { Document } from 'src/app/models/Document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:91/api/documents'; // API base URL

  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(error);
  }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDocumentsByStatus(status: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/status/${status}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  searchDocuments(name?: string, type?: string, codeUnique?: string, startDate?: string, endDate?: string, sort?: string): Observable<Document[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (type) params = params.set('type', type);
    if (codeUnique) params = params.set('codeUnique', codeUnique);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (sort) params = params.set('sort', sort);
    return this.http.get<Document[]>(`${this.apiUrl}/search`, { params, headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  saveDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}`, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateDocumentStatus(id: number, status: string, commentaireRejet?: string): Observable<Document> {
    const params = new HttpParams()
      .set('status', status)
      .set('comment', commentaireRejet || '');
    return this.http.put<Document>(`${this.apiUrl}/${id}/status`, null, { params, headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addDocumentVersion(documentId: number, file: File, userId: number): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return this.http.post<Document>(`${this.apiUrl}/${documentId}/versions`, formData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDocumentVersions(documentId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/${documentId}/versions`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDocumentsByDepartmentAndWorkflow(departmentName: string, workflowStage: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/department/${departmentName}/workflow/${workflowStage}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  downloadDocument(id: number): Observable<Blob> {
    const url = `/api/documents/${id}/file`;
    return this.http.get(url, { responseType: 'blob', headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  closeWorkflow(documentId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${documentId}/close`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getArchivedDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/archived`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDocumentTypeStatistics(): Observable<{type: string, count: number}[]> {
    return this.http.get<{type: string, count: number}[]>(`${this.apiUrl}/statistics`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getDocumentDepartmentStatistics(): Observable<{department: string, count: number}[]> {
    return this.http.get<{department: string, count: number}[]>(`${this.apiUrl}/department-statistics`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
