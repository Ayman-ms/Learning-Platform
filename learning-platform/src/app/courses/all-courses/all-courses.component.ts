import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';
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
  subCategoryList: any[] = [];
  filteredSubCategories: any[] = [];

  selectedMainCategory: any = null;
  selectedSubCategory: any = null;

  constructor(
    private coursesService: CoursesService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService
  ) {}

  async ngOnInit() {
    this.coursesService.getCourses().subscribe((courses) => {
      this.coursesList = courses || [];
    });

    this.mainCategoryList = (await this.mainCategoryService.getMainCategories()) ?? [];
    this.subCategoryList = (await this.subCategoryService.getSubCategories()) ?? [];
    console.log('Main Categories:', this.mainCategoryList);
    console.log('Sub Categories:', this.subCategoryList); 
  }

  countCoursesBySubCategory(subCategoryId: number): number {
    return this.coursesList.filter(course => course.subCategoryId === subCategoryId).length;
  }

  getImagePath(imageFilePath: string | undefined): string {
    if (!imageFilePath || imageFilePath.trim() === '') {
      return 'assets/default-profile.png'; // صورة افتراضية
    }
    return `http://localhost:5270${imageFilePath}`; // تأكد من ربط الصورة بالسيرفر
  }

  // selectMainCategory(main: any) {
  //   this.selectedMainCategory = main;
  //   this.filteredSubCategories = this.subCategoryList.filter(
  //     (sub) => sub.mainCategoryId === main.id
  //   );
  //   console.log('Filtered Sub Categories:', main);
  //   this.selectedSubCategory = null;
  //   this.filteredCourses = [];
  // }

  // selectSubCategory(sub: any) {
  //   this.selectedSubCategory = sub;
  //   this.filteredCourses = this.coursesList.filter(
  //     (course) => course.subCategoryId === sub.id
  //   );
  // }
}