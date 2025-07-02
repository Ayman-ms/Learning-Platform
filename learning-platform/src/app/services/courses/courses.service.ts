import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Course } from 'src/app/models/courses';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'http://localhost:5270/api/Courses';
  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}`)
      .pipe(
        tap(courses => {
          courses.forEach(course => {
            course.subCategories = course.subCategories?.filter(subCat => subCat !== null) || [];
          });
        }),
        catchError(this.handleError)
      );
  }

  addCourse(formData: FormData): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, formData);
  }

  // src/app/services/course.service.ts
  createCourse(course: Course, photo: File): Observable<Course> {
    const formData = new FormData();
    formData.append('id', course.id);
    formData.append('name', course.name);
    formData.append('description', course.description);
    formData.append('status', String(course.status));
    formData.append('teacher', course.teacher);
    if (photo) {
      formData.append('photo', photo, photo.name);
    }
    return this.http.post<Course>(this.apiUrl, formData);
  }

  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, course);
  }

  updateCourseWithImage(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData)
      .pipe(
        tap(response => console.log('Update response:', response)),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
  
  deleteCourse(id: string): Promise<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).toPromise().then(() => true).catch(() => false);;
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: any): Observable<never> {
    throw error;
  }
}
