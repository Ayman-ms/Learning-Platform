import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { MessageService } from 'primeng/api';
import { ImageService } from 'src/app/services/image/image.service';

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
  filteredUsers: any = null;
  rollNumbers: Set<string> = new Set();

  constructor(
    private studentsService: StudentsService,
    public accountService: SessionService,
    private messageService: MessageService,
    public imageService: ImageService
  ) { }

  async ngOnInit() {
    this.studentsList = await this.studentsService.getStudents() || [];
    this.filteredStudents = [...this.studentsList];
    this.displayedStudents = [...this.studentsList].slice(0, 12);

    this.studentsList.forEach(student => {
      this.rollNumbers.add(student.roll);
    });
  }

  selectRoll(roll: any) {
    this.filteredUsers = roll;

    //  filter courses by main category
    this.displayedStudents = this.filteredStudents.filter(
      (student) => student.roll === roll
    );
  }

  clearFilter() {
    this.filteredUsers = null;
    this.displayedStudents = [...this.studentsList];
  }

  updateSearch(searchText: string) {
    this.filteredStudents = searchText
      ? this.studentsList.filter(student =>
        student.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase())
      )
      : [...this.studentsList];
    this.displayedStudents = this.filteredStudents.slice(0, 12);
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
      return 'assets/courseImage.svg';
    }
    const unique = new Date().getTime(); 
    return photoPath;
  }

  handleImageError(event: any) {
    event.target.src = 'assets/courseImage.svg';
  }
}