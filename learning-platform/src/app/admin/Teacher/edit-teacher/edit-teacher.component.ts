import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent {
  teacherToEdit: Teacher = {
    id: 0, firstName: '', password: '', email: '', phone: 0,
    lastName: '',
    avatar: ''
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
    this.httpClient.get<Array<Teacher>>('https://localhost:44355/teacher').subscribe((teacherListItems) => {
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

  async updateClick() {
    let result = await this.teacherService.updateTeacher(this.teacherToEdit);
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Success..', detail: 'Teacher edited' });
      this.router.navigateByUrl('admin');
      this.router.navigateByUrl('');
    } else {
      console.log('Edit not successful');
      alert("Edit not successful");
    }
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
}
