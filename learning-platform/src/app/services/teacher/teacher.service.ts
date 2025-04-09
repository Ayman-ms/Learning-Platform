import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Teacher } from 'src/app/models/teacher';
import { APP_CONSTANTS } from 'src/constants/app.constants';
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

  private readonly apiUrl = APP_CONSTANTS.API_ENDPOINTS.TEACHERS;

  constructor(private http: HttpClient) { }

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTeacher(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  registerTeacher(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData, {
      headers: new HttpHeaders({
      })
    }).pipe(
      tap(response => console.log('Teacher registered successfully:', response)),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  public deleteTeacher(id: string) {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).toPromise();
  }

  updateTeacher(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('❌ API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }


}