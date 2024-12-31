import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/courses'; 

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'https://api.skillwave.com/courses'; // رابط الـ API الخاص بالكورسات

  constructor(private http: HttpClient) {}

  // جلب جميع الكورسات
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  // إضافة كورس جديد
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  // تحديث بيانات كورس
  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  // حذف كورس
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // الحصول على كورس واحد
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }
}
