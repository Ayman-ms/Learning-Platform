import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private apiUrl = 'https://localhost:44355/Password'; //API URL 

  constructor(private http: HttpClient) { }

  // Function to send password recovery email
  sendPasswordForget(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/SendPasswordForget`, email, { responseType: 'text' });
  }

  // Function to reset password
  resetPassword(token: string, password: string, passwordConf: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ResetPassword`, {
      token,
      password,
      passwordConf
    }, { responseType: 'text' });
  }

  generateRandomPassword(): string {
    const length = 10;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allChars = uppercase + lowercase + numbers + specialChars;
    let password = '';

    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i =6; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
}
