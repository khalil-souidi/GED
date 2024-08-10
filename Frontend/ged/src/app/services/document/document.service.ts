import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from 'src/app/models/Document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:91/api/documents'; // API base URL

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}`);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  getDocumentsByStatus(status: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/status/${status}`);
  }

  searchDocuments(name?: string, type?: string, codeUnique?: string, startDate?: string, endDate?: string, sort?: string): Observable<Document[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (type) params = params.set('type', type);
    if (codeUnique) params = params.set('codeUnique', codeUnique);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (sort) params = params.set('sort', sort);
    return this.http.get<Document[]>(`${this.apiUrl}/search`, { params });
  }

  saveDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}`, formData);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateDocumentStatus(id: number, status: string, commentaireRejet?: string): Observable<Document> {
    const params = new HttpParams()
      .set('status', status)
      .set('comment', commentaireRejet || '');
    return this.http.put<Document>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  addDocumentVersion(documentId: number, file: File, userId: number): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return this.http.post<Document>(`${this.apiUrl}/${documentId}/versions`, formData);
  }

  getDocumentVersions(documentId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/${documentId}/versions`);
  }

  getDocumentsByDepartmentAndWorkflow(departmentName: string, workflowStage: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/department/${departmentName}/workflow/${workflowStage}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    const url = `/api/documents/${id}/file`;
    return this.http.get(url, { responseType: 'blob' });
  }
  
  closeWorkflow(documentId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${documentId}/close`, {});
  }

  getArchivedDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/archived`);
  }

  getDocumentTypeStatistics(): Observable<{type: string, count: number}[]> {
    return this.http.get<{type: string, count: number}[]>(`${this.apiUrl}/statistics`);
  }
}
