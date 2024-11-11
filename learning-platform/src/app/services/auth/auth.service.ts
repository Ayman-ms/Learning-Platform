import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // دالة للتحقق من وجود المستخدم حسب البريد الإلكتروني
  checkUserEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>('/api/check-email', { email });
  }

  // دالة لإرسال البريد الإلكتروني لإعادة تعيين كلمة المرور
  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.post('/api/send-reset-password-email', { email });
  }
}
