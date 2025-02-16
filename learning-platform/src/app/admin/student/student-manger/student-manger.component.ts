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
  itemsPerPage: number = 12;
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

    if (result) {
      this.messageService.clear();
      this.messageService.add({ key: 'c', sticky: true, severity: 'error', summary: 'Are you sure?', detail: 'Confirm to proceed' });
      window.location.reload()
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something false!' });
    
  }

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

  // 🔥 تحديث بيانات الصورة والتحقق من صحتها
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
}
