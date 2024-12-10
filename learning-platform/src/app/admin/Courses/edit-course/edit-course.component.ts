import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { Courses } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  coursesToEdit: Courses = {
    id: 0, name: '', category: '', description: '', status: false, teacherID: 0,
    time: 0
  };
  // input status
  isNameDisabled = true;
  isCategoryDisabled = true;
  isDescriptionDisabled = true;
  isTeacherIDDisabled = true;
  isStatusDisabled = true;
  isTimeDisabled = true;
  // course
  courseIsAdmin = false;
  courseLoggedIn = false;
  courseForm = new FormGroup({
    name: new FormControl(this.coursesToEdit.name, Validators.required),
    category: new FormControl(this.coursesToEdit.category, Validators.required),
    description: new FormControl(this.coursesToEdit.description, Validators.required),
    status: new FormControl(this.coursesToEdit.status, Validators.required),
    teacherID: new FormControl(this.coursesToEdit.teacherID, Validators.required),
    time: new FormControl(this.coursesToEdit.time, Validators.required)

  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private courseService: CoursesService,
    public accountService: SessionService,
    private messageService: MessageService
  ) {
  }

  courseList?: Array<Courses>;

  ngOnInit(): void {
    this.httpClient.get<Array<Courses>>('https://localhost:44355/User').subscribe((courseListItems) => {
      this.route.queryParams.subscribe(params => {
        console.log(params['id']);
        for (let course of courseListItems) {
          if (course.id == params['id']) {
            this.coursesToEdit = course;
            this.courseForm.patchValue(course);
            break;
          }
        }
      });
    });
  }

  async updateClick() {
    let result = await this.courseService.updateCourses(this.coursesToEdit);
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Success..', detail: 'Course edited' });
      this.router.navigateByUrl('admin');
    } else {
      console.log('Edit not successful');
      alert("Edit not successful");
    }
  }
  // toggle input status
  toggleNameEdit() {
    this.isNameDisabled = !this.isNameDisabled;
  }
  toggleCategoryEdit() {
    this.isCategoryDisabled = !this.isCategoryDisabled;
  }
  toggleDescription() {
    this.isDescriptionDisabled = !this.isDescriptionDisabled;
  }
  toggleTeacherIDEdit() {
    this.isTeacherIDDisabled = !this.isTeacherIDDisabled;
  }
  toggleStatusEdit() {
    this.isStatusDisabled = !this.isStatusDisabled;
  }
  toggleTimeEdit() {
    this.isTimeDisabled = !this.isTimeDisabled;
  }
  msgs = new Array<Message>();

  clickMessage() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Course edited' });
  }
}

