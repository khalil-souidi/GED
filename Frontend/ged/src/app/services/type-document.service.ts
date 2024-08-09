import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeDocument } from '../models/type-document.model';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  private apiUrl = 'http://localhost:91/api/type-documents'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getAllTypeDocuments(): Observable<TypeDocument[]> {
    return this.http.get<TypeDocument[]>(`${this.apiUrl}`);
  }

  getTypeDocumentById(id: number): Observable<TypeDocument> {
    return this.http.get<TypeDocument>(`${this.apiUrl}/${id}`);
  }

  getTypeDocumentByNom(nom: string): Observable<TypeDocument> {
    return this.http.get<TypeDocument>(`${this.apiUrl}/nom/${nom}`);
  }

  createTypeDocument(typeDocument: TypeDocument): Observable<TypeDocument> {
    return this.http.post<TypeDocument>(`${this.apiUrl}`, typeDocument);
  }

  deleteTypeDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
