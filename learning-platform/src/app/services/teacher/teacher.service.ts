import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/models/teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  api = "http://localhost:5270/api/Teacher"

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // public createTeacher(teacher: FormData): Observable<any> {
  //   return this.http.post(this.api, teacher);
  // }
  registerTeacher(formData: FormData): Observable<any> {
    return this.http.post(this.api, formData);
  }
  
  public updateTeacher(teacher: Teacher) {
    return this.http.put<Teacher>(this.api, teacher).toPromise();
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

  public getTeacher(teacher: Teacher) {
    return this.http.get<Array<Teacher>>(this.api).toPromise();
  }

  public getTeachers() {
    return this.http.get<Teacher[]>(this.api).toPromise();
  }
}