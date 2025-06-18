import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:5270/api/Enrollments';

  constructor(private http: HttpClient) { }

  enroll(studentId: string, courseId: string): Observable<any> {
    const enrollment = {
      studentId: studentId,
      courseId: courseId,
      enrollDate: new Date().toISOString()
    };

    return this.http.post(this.apiUrl, enrollment);
  }

  getEnrollmentsByStudent(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?studentId=${studentId}`);
  }
}
