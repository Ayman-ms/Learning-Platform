import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-manger',
  templateUrl: './student-manger.component.html',
  styleUrls: ['./student-manger.component.css']
})
export class StudentMangerComponent implements OnInit {
  userLoggedIn = false;
  studentsList: Array<Student> = [];
  filteredStudents: Array<Student> = [];
  displayedStudents: Array<Student> = [];

  constructor(
    private studentsService: StudentsService,
    public accountService: SessionService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.studentsList = await this.studentsService.getStudents() || [];
    this.filteredStudents = [...this.studentsList];
    this.displayedStudents = [...this.studentsList].slice(0, 12);
  }

  updateSearch(searchText: string) {
    this.filteredStudents = searchText
      ? this.studentsList.filter(student =>
          student.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          student.email.toLowerCase().includes(searchText.toLowerCase())
        )
      : [...this.studentsList];
  }

  onPaginatedData(event: Student[]) {
    this.displayedStudents = event;
  }

  async deleteStudent(id: string) {
    let result = await this.studentsService.deleteStudent(id);
    window.location.reload();
  }

  getImagePath(photoPath: string | undefined): string {
    if (!photoPath || photoPath.trim() === '') {
      return 'assets/default-profile.png';
    }
    return photoPath;
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-profile.png';
  }
}