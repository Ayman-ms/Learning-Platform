import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from 'src/app/models/student';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  api = "http://localhost:5270/api/Student"

  constructor(private http: HttpClient) { }

  registerStudent(formData: FormData): Observable<any> {
    return this.http.post(`${this.api}/register`, formData);
  }

  public updateUser(user: Student) {
    return this.http.put<Student>(this.api, user).toPromise();
  }
  public deleteUser(id: number) {
    return this.http.delete<number>(this.api, { params: { id: id } }).toPromise();
  }
  

  getUser(user: Student) {
    return this.http.get<Array<Student>>(this.api).toPromise();
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.api}/${id}`);
  }
  
  updateStudent(id: string, formData: FormData) {
    return this.http.put<Student>(`${this.api}/${id}`, formData);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.api}/upload`, formData);
  }


  // all user
  public getUsers() {
    return this.http.get<Student[]>(this.api).toPromise();
  }
}