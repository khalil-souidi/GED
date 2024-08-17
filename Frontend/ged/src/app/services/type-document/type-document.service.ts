import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeDocument } from 'src/app/models/type-document.model';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
  private apiUrl = 'http://localhost:91/api/typedocuments'; // API base URL

  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.oauthService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllTypeDocuments(): Observable<TypeDocument[]> {
    return this.http.get<TypeDocument[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }
}
