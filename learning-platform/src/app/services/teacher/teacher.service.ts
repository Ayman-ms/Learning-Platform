import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Teacher } from 'src/app/models/teacher';
export interface TeacherRegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}
@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:5270/api/Teacher';

  constructor(private http: HttpClient) {}

  // تسجيل مدرس جديد
  registerTeacher(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData)
      .pipe(
        tap(response => console.log('✅ تم تسجيل المدرس بنجاح:', response)),
        catchError(this.handleError)
      );
  }

  // الحصول على جميع المدرسين
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // الحصول على مدرس معين بواسطة المعرف
  getTeacher(id: string): Observable<Teacher> {
    console.log(`طلب بيانات المدرس بالمعرف: ${id}`);
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(data => console.log('تم استلام بيانات المدرس:', data)),
        catchError(this.handleError)
      );
  }

  // تحديث بيانات المدرس (بالطريقة القديمة - JSON)
  updateTeacher(id: string, teacherData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, JSON.stringify(teacherData), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // تحديث بيانات المدرس باستخدام FormData (للتعامل مع الملفات)
// تحديث بيانات المدرس باستخدام FormData (للتعامل مع الملفات)
updateTeacherWithFormData(id: string, formData: FormData): Observable<any> {
  // لا نحتاج لتحديد Content-Type هنا - سيتم تحديده تلقائيًا بواسطة HttpClient
  return this.http.put(`${this.apiUrl}/${id}`, formData);
}
  

  // الحصول على قائمة المدرسين
  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }  

  public deleteTeacher(id: string) {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).toPromise();
  }

  // معالجة الأخطاء
  private handleError(error: HttpErrorResponse) {
    console.error('❌ حدث خطأ في الطلب:', error);
    
    // طباعة تفاصيل الخطأ
    if (error.error instanceof ErrorEvent) {
      // خطأ على جانب العميل أو مشكلة في الشبكة
      console.error('❌ خطأ على جانب العميل:', error.error.message);
      return throwError(() => new Error(`خطأ في الاتصال: ${error.error.message}`));
    } else {
      // خطأ من الخادم
      console.error(`❌ كود الخطأ: ${error.status}, رسالة: ${error.message}`);
      console.error('❌ تفاصيل الخطأ من الخادم:', error.error);
      
      // معالجة أخطاء التحقق
      if (error.status === 400 && error.error && error.error.errors) {
        const validationErrors = error.error.errors;
        let errorMessage = 'أخطاء التحقق: ';
        
        for (const field in validationErrors) {
          if (validationErrors.hasOwnProperty(field)) {
            errorMessage += `${field}: ${validationErrors[field].join(', ')}; `;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      }
      
      return throwError(() => new Error(error.error?.title || 'حدث خطأ أثناء الاتصال بالخادم'));
    }
  }
}