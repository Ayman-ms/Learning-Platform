import { Component } from '@angular/core';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.css']
})
export class AdminTeacherComponent {

  constructor(private TeachersService: TeacherService) { }
  TeachersList: Array<Teacher> = [];
  filteredTeachers: Array<Teacher> = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  paginatedTeachers: Array<Teacher> = [];
  searchText: string = '';

  async ngOnInit() {
    this.TeachersList = await this.TeachersService.getTeachers() || [];
    this.filteredTeachers = this.TeachersList;
    this.updatePagination();
  }

  // تحديث النتائج بناءً على البحث
  updateSearch() {
    if (this.searchText) {
      this.filteredTeachers = this.TeachersList.filter(teacher =>
        teacher.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        teacher.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredTeachers = this.TeachersList;
    }
    this.currentPage = 1; // إعادة تعيين الصفحة إلى الأولى عند البحث
    this.updatePagination();
  }

  //start pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTeachers = this.filteredTeachers.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredTeachers.length) {
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
  //end pagination
}
