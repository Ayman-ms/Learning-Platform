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
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedStudents: Array<Student> = [];
  searchText: string = '';
  paginatedRows: Array<Array<Student>> = [];

  constructor(private studentsService: StudentsService, public accountService: SessionService, private messageService: MessageService) { }

  async ngOnInit() {
    this.studentsList = await this.studentsService.getStudents() || [];
    this.filteredStudents = this.studentsList;
  
    console.log("📌 الطلاب المستلمون من API:", this.studentsList);
  
    this.updatePagination();
  }
  

  updateSearch() {
    if (this.searchText) {
      this.filteredStudents = this.studentsList.filter(student =>
        student.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        student.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredStudents = this.studentsList;
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, endIndex);

    this.paginatedRows = [];
    for (let i = 0; i < this.paginatedStudents.length; i += 3) {
      this.paginatedRows.push(this.paginatedStudents.slice(i, i + 3));
    }
  }

 async deleteStudent(id:string){
    let result = await this.studentsService.deleteStudent(id)
    window.location.reload()
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredStudents.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  getImagePath(imageFileName: string | undefined): string {
    if (!imageFileName || imageFileName.trim() === '') {
      console.warn("❌ لا توجد صورة، سيتم استخدام الصورة الافتراضية.");
      return 'assets/default-profile.png'; // صورة افتراضية عند عدم وجود صورة
    }
  
    return `${imageFileName}`;
  }
}
