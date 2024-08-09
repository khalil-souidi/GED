import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeDocument } from 'src/app/models/type-document.model';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  private apiUrl = 'http://localhost:91/api/typedocuments'; // API base URL

  constructor(private http: HttpClient) {}

  getAllTypeDocuments(): Observable<TypeDocument[]> {
    return this.http.get<TypeDocument[]>(`${this.apiUrl}`);
  }
}
