import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './all-courses.component.html',
  styleUrl: './all-courses.component.css'
})
export class AllCoursesComponent implements OnInit {
  coursesList: any[] = [];
  filteredCourses: any[] = [];
  mainCategoryList: any[] = [];
  selectedMainCategory: any = null;

  constructor(
    private coursesService: CoursesService,
    private mainCategoryService: MainCategoryService
  ) {}

  async ngOnInit() {
    this.coursesService.getCourses().subscribe((courses) => {
      this.coursesList = courses || [];
      this.filteredCourses = [...this.coursesList];
    });

    this.mainCategoryList = (await this.mainCategoryService.getMainCategories()) ?? [];
  }

  getImagePath(imageFilePath: string | undefined): string {
    if (!imageFilePath || imageFilePath.trim() === '') {
      return 'assets/default-profile.png';
    }
    return `http://localhost:5270${imageFilePath}`; 
  }

  selectMainCategory(main: any) {
    this.selectedMainCategory = main;

    //  filter courses by main category
    this.filteredCourses = this.coursesList.filter(
      (course) => course.mainCategory === main.description
    );
  }
  
  clearFilter() {
    this.selectedMainCategory = null;
    this.filteredCourses = [...this.coursesList]; // retern to original list
  }
}