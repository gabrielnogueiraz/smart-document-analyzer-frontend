import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = signal(false);
  public loading$ = this.loadingSubject.asReadonly();

  setLoading(loading: boolean): void {
    this.loadingSubject.set(loading);
  }

  getLoading(): boolean {
    return this.loadingSubject();
  }
}
