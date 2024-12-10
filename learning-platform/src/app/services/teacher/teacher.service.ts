import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  api = "https://localhost:44355/api/User"

  constructor(private http: HttpClient) { }

  public createTeacher(teacher: FormData): Observable<any> {
    return this.http.post(this.api, teacher);
  }
  public updateTeacher(teacher: Teacher) {
    return this.http.put<Teacher>(this.api, teacher).toPromise();
  }
  public deleteTeacher(id: number) {
    return this.http.delete<number>(this.api, { params: { id: id } }).toPromise();
  }
  public getTeacher(teacher: Teacher) {
    return this.http.get<Array<Teacher>>(this.api).toPromise();
  }
  // all Teacher
  public getTeachers() {
    return this.http.get<Teacher[]>(this.api).toPromise();
  }
}