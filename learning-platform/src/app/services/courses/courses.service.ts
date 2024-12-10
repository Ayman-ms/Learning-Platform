import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Courses } from 'src/app/models/courses';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  api = "https://localhost:44355/api/courses"

  constructor(private http: HttpClient) { }

  public createCourses(course: FormData): Observable<any> {
    return this.http.post(this.api, course);
  }
  public updateCourses(course: Courses) {
    return this.http.put<Courses>(this.api, course).toPromise();
  }
  public deleteCourses(id: number) {
    return this.http.delete<number>(this.api, { params: { id: id } }).toPromise();
  }
  public getCourse(course: Courses) {
    return this.http.get<Array<Courses>>(this.api).toPromise();
  }
  // all Courses
  public getCourses() {
    return this.http.get<Courses[]>(this.api).toPromise();
  }
}
