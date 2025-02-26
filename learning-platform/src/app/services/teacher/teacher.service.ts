import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private api = "http://localhost:5270/api/Teacher";

  constructor(private http: HttpClient) {}

  registerTeacher(formData: FormData): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.api}/register`, formData);
  }

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.api);
  }

  updateTeacher(id: string, formData: FormData): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.api}/${id}`, formData);
  }

  deleteTeacher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
