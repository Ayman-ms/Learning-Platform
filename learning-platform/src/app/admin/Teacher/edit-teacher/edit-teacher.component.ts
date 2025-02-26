import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent {
  teacherToEdit: Teacher = {
    id: '', firstName: '', password: '', email: '', phone: '',
    lastName: '',
    profileImage: ''
  };

  // input status
  isFirstNameDisabled = true;
  isLastNameDisabled = true;
  isPasswordDisabled = true;
  isEmailDisabled = true;
  isPhoneDisabled = true;

  // teacher
  teacherIsAdmin = false;
  teacherLoggedIn = false;
  teacherForm = new FormGroup({
    firstName: new FormControl(this.teacherToEdit.firstName, Validators.required),
    lastName: new FormControl(this.teacherToEdit.lastName, Validators.required),
    password: new FormControl(this.teacherToEdit.password, [
      Validators.minLength(6),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$"),
      Validators.required
    ]),
    email: new FormControl(this.teacherToEdit.email, [Validators.required, Validators.email])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private teacherService: TeacherService,
    private messageService: MessageService
  ) { }

  teacherList?: Array<Teacher>;

  ngOnInit(): void {
    this.httpClient.get<Array<Teacher>>('http://localhost:5270/api/Teacher').subscribe((teacherListItems) => {
      this.route.queryParams.subscribe(params => {
        console.log(params['id']);
        for (let teacher of teacherListItems) {
          if (teacher.id == params['id']) {
            this.teacherToEdit = teacher;
            this.teacherForm.patchValue(teacher);
            break;
          }
        }
      });
    });
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
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Teacher edited' });
  }


  teacherToEditFormData(): FormData {
    const formData = new FormData();
    formData.append('firstName', this.teacherToEdit.firstName);
      formData.append('lastName', this.teacherToEdit.lastName);
      formData.append('phone', this.teacherToEdit.phone);
      formData.append('email', this.teacherToEdit.email);
    return formData;
}
 

  async updateClick() {
    try {
        let formData = this.teacherToEditFormData();
        let result = await firstValueFrom(this.teacherService.updateTeacher(this.teacherToEdit.id, formData));
        if (result) {
            this.messageService.add({ severity: 'success', summary: 'Success..', detail: 'Teacher edited' });
            this.router.navigateByUrl('admin');
            this.router.navigateByUrl('');
        } else {
            console.log('Edit not successful');
            alert("Edit not successful");
        }
    } catch (error) {
        console.error("❌ Error updating teacher:", error);
        alert("Error updating teacher. Please try again later.");
    }
}

  deleteTeacher(id:string){

  }
}