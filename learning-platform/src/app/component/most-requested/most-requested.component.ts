import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { Course } from 'src/app/models/courses';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
@Component({
  selector: 'app-most-requested',
  templateUrl: './most-requested.component.html',
  styleUrls: ['./most-requested.component.css']
})
export class MostRequestedComponent implements OnInit {

  constructor(private coursesService: CoursesService,
    private mainCategory: MainCategoryService
  ) { }
  topRatedCourses: Course[] = [];
  selectedCategories: any[] = [];

  ngOnInit(): void {
    this.mainCategory.getMainCategories().then(categories => {
      const shuffled = categories.sort(() => 0.5 - Math.random());
      // pick first 3 only
      this.selectedCategories = shuffled.slice(0, 3);
    }).catch(error => {
      console.error('Error fetching main categories:', error);
    
    });


    this.coursesService.getCourses().subscribe({
      next: (courses: Course[]) => {
      const activveCourses = courses.filter(course => course.status);
      this.topRatedCourses = activveCourses
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);  
      }
    });
  }

  getImagePath(imageFilePath: string | undefined): string {
    if (!imageFilePath || imageFilePath.trim() === '') {
      return 'assets/courseImage.svg';
    }
    const unique = new Date().getTime(); 
    return `http://localhost:5270${imageFilePath}`; 
  }
}
