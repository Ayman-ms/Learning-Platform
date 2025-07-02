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

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new Blob([u8arr], { type: mime });
  }
  
  public async updateStudent(student: Student, file?: File): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('FirstName', student.firstName);
      formData.append('LastName', student.lastName);
      formData.append('Email', student.email);
      formData.append('Phone', student.phone);
      formData.append('Password', student.password);
  
      if (file) {
        formData.append('Photo', file);
      }
  
      const response = await this.http.put(`${this.api}${student.id}`, formData).toPromise();
      return !!response;
    } catch (error) {
      console.error('Update error:', error);
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