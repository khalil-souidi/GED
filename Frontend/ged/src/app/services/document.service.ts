import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/Document.model';
import { DocumentVersion } from '../models/DocumentVersion.model';
import { Users } from '../models/Users.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:91/api/documents'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}`);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  getDocumentsByStatus(status: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/status/${status}`);
  }

  saveDocument(document: Document, file: File, user: Users, typeDocNom: string): Observable<Document> {
    const formData = new FormData();
    formData.append('document', JSON.stringify(document));
    formData.append('file', file);
    formData.append('user', JSON.stringify(user));
    formData.append('typeDocNom', typeDocNom);
    return this.http.post<Document>(`${this.apiUrl}`, formData);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateDocumentStatus(id: number, status: string, commentaireRejet: string): Observable<Document> {
    const params = new HttpParams()
      .set('status', status)
      .set('comment', commentaireRejet);
    return this.http.put<Document>(`${this.apiUrl}/${id}/status`, null, { params });
  }
  

  addDocumentVersion(documentId: number, file: File, user: Users): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', JSON.stringify(user));
    return this.http.post<Document>(`${this.apiUrl}/versions/${documentId}`, formData);
  }

  getDocumentVersions(documentId: number): Observable<DocumentVersion[]> {
    return this.http.get<DocumentVersion[]>(`${this.apiUrl}/versions/${documentId}`);
  }
}
