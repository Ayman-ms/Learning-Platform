import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private baseUrl = 'https://localhost:44355/Password'; //API URL 

  constructor(private http: HttpClient) { }

// Function to send password recovery email
sendPasswordForget(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.baseUrl}/SendPasswordForget`, { params });
  }

// Function to reset password
  resetPassword(email: string, password: string, passwordConf: string): Observable<boolean> {
    const body = { email, password, passwordConf };
    return this.http.post<boolean>(`${this.baseUrl}/ResetPassword`, body);
  }
}
