import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { MessageService } from 'primeng/api';
import { PaginationControlComponent } from '../../components/pagination-control/pagination-control.component';
@Component({
  selector: 'app-student-manger',
  templateUrl: './student-manger.component.html',
  styleUrls: ['./student-manger.component.css']
})
export class StudentMangerComponent implements OnInit {

  userLoggedIn = false;
  studentsList: Array<Student> = [];
  filteredStudents: Array<Student> = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedStudents: Array<Student> = [];
  searchText: string = '';
  paginatedRows: Array<Array<Student>> = [];

  constructor(private studentsService: StudentsService, public accountService: SessionService, private messageService: MessageService) { }

  async ngOnInit() {
    this.studentsList = await this.studentsService.getStudents() || [];
    this.filteredStudents = [...this.studentsList];
    this.updateSearch('');
  }

  updateSearch(searchText: string) {
    this.filteredStudents = searchText
      ? this.studentsList.filter(student =>
          student.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          student.email.toLowerCase().includes(searchText.toLowerCase())
        )
      : [...this.studentsList];

    this.paginatedStudents = [...this.filteredStudents];
  }

  onPaginatedData(event: Student[]) {
    this.paginatedStudents = event;
  }

  async deleteStudent(id: string) {
    let result = await this.studentsService.deleteStudent(id)
    window.location.reload()
  }

  getImagePath(imageFileName: string | undefined): string {
    if (!imageFileName || imageFileName.trim() === '') {
      return 'assets/default-profile.png';
    }

    return `${imageFileName}`;
  }
}
