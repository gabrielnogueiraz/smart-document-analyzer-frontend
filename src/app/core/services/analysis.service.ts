import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Analysis, CreateAnalysisRequest, AnalysisStats } from '../models/analysis.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createAnalysis(request: CreateAnalysisRequest): Observable<Analysis> {
    return this.http.post<Analysis>(`${this.API_URL}/analysis`, request);
  }

  getAnalyses(): Observable<Analysis[]> {
    return this.http.get<Analysis[]>(`${this.API_URL}/analysis`);
  }

  getAnalysis(id: string): Observable<Analysis> {
    return this.http.get<Analysis>(`${this.API_URL}/analysis/${id}`);
  }

  deleteAnalysis(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/analysis/${id}`);
  }

  getAnalysisStats(): Observable<AnalysisStats> {
    return this.http.get<AnalysisStats>(`${this.API_URL}/analysis/stats/overview`);
  }
}
