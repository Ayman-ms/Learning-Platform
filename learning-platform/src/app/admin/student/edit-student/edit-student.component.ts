import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { StudentsService } from 'src/app/services/students/students.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  studentToEdit: Student = {
    id: '', firstName: '', password: '', email: '', phone: '',
    lastName: '',
    profileImage: '',
    createdAt: ''
  };

  // input status
  isFirstNameDisabled = true;
  isLastNameDisabled = true;
  isPasswordDisabled = true;
  isEmailDisabled = true;
  isPhoneDisabled = true;

  // user
  studentLoggedIn = false;
  studentForm = new FormGroup({
    firstName: new FormControl(this.studentToEdit.firstName, Validators.required),
    lastName: new FormControl(this.studentToEdit.lastName, Validators.required),
    password: new FormControl(this.studentToEdit.password, [
      Validators.minLength(6),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$"),
      Validators.required
    ]),
    email: new FormControl(this.studentToEdit.email, [Validators.required, Validators.email]),
    // level: new FormControl(this.studentToEdit.level)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private studentsService: StudentsService,
    public accountService: SessionService,
    private messageService: MessageService
  ) {
    accountService.user.subscribe((u) => {
      this.studentLoggedIn = u && u.firstName !== 'anonymos';
    });
  }


  ngOnInit(): void {
    this.httpClient.get<Array<Student>>('http://localhost:5270/api/Student').subscribe((userListItems) => {
      this.route.queryParams.subscribe(params => {
        console.log(params['id']);
        for (let user of userListItems) {
          if (user.id == params['id']) {
            this.studentToEdit = user;
            this.studentForm.patchValue(user);
            break;
          }
        }
      });
    });
  }

  async updateClick() {
    let result = await this.studentsService.updateStudent(this.studentToEdit);

    if (result === true) { 
      this.messageService.add({ severity: 'success', summary: 'Success..', detail: 'User edited' });
      this.router.navigateByUrl('admin/students');
    } else {
      alert("Edit not successful");
    }
  }
  generateRandomPassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.studentForm.patchValue({ password });
  }
  // toggle input status
  toggleFirstNameEdit() {
    this.isFirstNameDisabled = !this.isFirstNameDisabled;
  }
  toggleLastNameEdit() {
    this.isLastNameDisabled = !this.isLastNameDisabled;
  }
  togglePasswordEdit() {
    this.isPasswordDisabled = !this.isPasswordDisabled;
  }
  toggleEmailEdit() {
    this.isEmailDisabled = !this.isEmailDisabled;
  }
  togglePhoneEdit() {
    this.isPhoneDisabled = !this.isPhoneDisabled;
  }
  msgs = new Array<Message>();

  clickMessage() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'User edited' });
  }
  getImageSource(photoBase64: string | undefined): string {
    if (!photoBase64 || photoBase64.trim() === '' || photoBase64 === 'undefined' || photoBase64 === 'null') {
      console.warn("❌ PhotoBase64 غير موجودة!");
      return 'assets/default-profile.png'; // صورة افتراضية
    }

    // التحقق من نوع الصورة
    let imageFormat = "jpeg"; // الافتراضي
    if (photoBase64.startsWith("iVBORw0KGgo")) {
      imageFormat = "png"; // صورة بصيغة PNG
    }

    return `data:image/${imageFormat};base64,${photoBase64.trim()}`;
  }

  async deleteStudent(id:string){
    let result = await this.studentsService.deleteStudent(id)
    this.router.navigate(['/admin/students'])
  }

  getImagePath(imageFileName: string | undefined): string {
    if (!imageFileName || imageFileName.trim() === '') {
      return 'assets/default-profile.png';
    }
    return `${imageFileName}`;
  }
}
