import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Course } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  courseId!: string;
  courseForm!: FormGroup;
  imagePreview: SafeUrl | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
  }


  
  private initForm(): void {
    this.courseForm = this.fb.group({
      name: [''],
      description: [''],
      status: [false],
      teacher: [''],
      photoPath: [''],
      mainCategory: [''],
      subCategories: [[]]
    });
  }

  ngOnInit(): void {
    this.initForm();
  
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
  
    if (this.courseId) {
      this.loadCourseDetails();
    } else {
      console.error('Course ID is undefined!');
    }
  }
  

  loadCourseDetails() {
    this.coursesService.getCourseById(this.courseId).subscribe(
      (course) => {
        if (course) {
          this.course = course; // ✅ أضف هذا السطر لتخزين الكورس في المتغير الصحيح
          console.log('Course Details:', course.photoPath);
          this.courseForm.patchValue({
            name: course.name,
            description: course.description,
            teacher: course.teacher,
            photoPath: course.photoPath,
            mainCategory: course.mainCategory,
            subCategories: course.subCategories
          });

          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(
            this.getImagePath(course.photoPath)
          );
          
        }
      },
      (error) => {
        this.errorMessage = 'Error loading teacher data';
        console.error('Error:', error);
      },
      () => {
        // this.isLoading = false;
      }
    );
  }
  getImagePath(imageFilePath: string | undefined): string {
    if (!imageFilePath || imageFilePath.trim() === '') {
      return 'assets/default-profile.png';
    }
    return `http://localhost:5270${imageFilePath}`;
  }
}
