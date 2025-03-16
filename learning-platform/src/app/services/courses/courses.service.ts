import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/courses'; 

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'http://localhost:5270/api/Courses'; // رابط الـ API الخاص بالكورسات

  constructor(private http: HttpClient) {}

  // جلب جميع الكورسات
  getCourses() {
    return this.http.get<Course[]>(this.apiUrl).toPromise();
  }

  // إضافة كورس جديد
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: string, course: Course): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, course);
  }

  // New method for updating with image
  updateCourseWithImage(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // حذف كورس
  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // الحصول على كورس واحد
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }
}
