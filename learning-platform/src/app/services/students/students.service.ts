import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  api = "http://localhost:5270/api/Student/"

  constructor(private http: HttpClient) { }

  registerStudent(formData: FormData) {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.http.post(`${this.api}register`, formData, { headers: headers });
  }


  public async updateStudent(student: Student): Promise<boolean> {
    try {
      const response = await this.http.put<Student>(`${this.api}${student.id}`, student).toPromise();
      return response ? true : false;
    } catch (error) {
      console.error("Error updating student:", error);
      return false;
    }
  }

  public deleteStudent(id: string): Promise<boolean> {
    return this.http.delete(`${this.api}${id}`)
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
  public getStudent(student: Student) {
    return this.http.get<Array<Student>>(this.api).toPromise();
  }
  // all user
  public getStudents() {
    return this.http.get<Student[]>(this.api).toPromise();
  }
}
