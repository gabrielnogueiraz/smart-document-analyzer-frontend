import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, DocumentText, UploadResponse } from '../models/document.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadDocument(file: File): Observable<HttpEvent<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(
      `${this.API_URL}/documents/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.API_URL}/documents`);
  }

  getDocument(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.API_URL}/documents/${id}`);
  }

  getDocumentText(id: string): Observable<DocumentText> {
    return this.http.get<DocumentText>(`${this.API_URL}/documents/${id}/text`);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/documents/${id}`);
  }
}
