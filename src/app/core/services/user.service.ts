import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserStats } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`);
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/profile`, userData);
  }

  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/profile`);
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.API_URL}/users/stats`);
  }
}
