import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5270/api/Student';

  constructor(private http: HttpClient
  ) { }

  checkUserEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>('/api/check-email', { email });
  }
  
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.post('/api/send-reset-password-email', { email });
  }
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

}
