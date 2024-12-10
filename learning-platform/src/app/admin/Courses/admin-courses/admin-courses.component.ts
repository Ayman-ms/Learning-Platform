import { Component } from '@angular/core';
import { Courses } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
})
export class AdminCoursesComponent {
  
  constructor(private coursesService: CoursesService, public accountService: SessionService) { }
  CoursesList: Array<Courses> = [];
  filteredCourses: Array<Courses> = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  paginatedCourses: Array<Courses> = [];
  searchText: string = '';

  async ngOnInit() {
    this.CoursesList = await this.coursesService.getCourses() || [];
    this.filteredCourses = this.CoursesList;
    this.updatePagination();
  }

  // تحديث النتائج بناءً على البحث
  updateSearch() {
    if (this.searchText) {
      this.filteredCourses = this.CoursesList.filter(course =>
        course.id ||
        course.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredCourses = this.CoursesList;
    }
    this.currentPage = 1; // إعادة تعيين الصفحة إلى الأولى عند البحث
    this.updatePagination();
  }

  //start pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCourses = this.filteredCourses.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredCourses.length) {
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
