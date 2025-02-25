import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  api = "http://localhost:5270/api/Student/"

  constructor(private http: HttpClient, private messageService: MessageService) { }

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

  public async deleteStudent(id: string) {
    let result = await this.http.delete(`${this.api}${id}`)
      .toPromise()
      .then(() => true)
      .catch(() => false);
    if (result) {
      this.messageService.clear();
      this.messageService.add({ key: 'c', sticky: true, severity: 'error', summary: 'Are you sure?', detail: 'Confirm to proceed' });
      
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something false!' });
    }
  }


  public getStudent(student: Student) {
    return this.http.get<Array<Student>>(this.api).toPromise();
  }
  // all user
  public getStudents() {
    return this.http.get<Student[]>(this.api).toPromise();
  }



}
