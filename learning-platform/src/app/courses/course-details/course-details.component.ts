import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Course } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { Teacher } from 'src/app/models/teacher';
import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { SessionService } from 'src/app/services/session/session.service';
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
  teachersList: Teacher[] = [];
  selectedTeacher: any = null;
  
  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private teachersService: TeacherService,
    private enrollmentService: EnrollmentService,
    private sessionService: SessionService
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
    this.teachersService.getTeachers().subscribe(teachers => {
      this.teachersList = teachers || [];
    });
  
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) this.loadCourseDetails();
    
  }
  
  getTeacherByName(teacherName: string) {
    if (!this.teachersList) return null;
  
    return this.teachersList.find(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      return fullName === teacherName.trim().toLowerCase();
    }) || null;
  }
  
  getTeacherImage(teacherName: string): string {
    const teacher = this.getTeacherByName(teacherName);
    if (teacher?.profileImage) {
      return `${teacher.profileImage}`;
    }
    return 'assets/default-profile.png';
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

  enrollInCourse() {
    const currentStudent = this.sessionService.getUser();
  
    if (!currentStudent || !currentStudent.id) {
      alert('You must be logged in to enroll in a course.');
      return;
    }
  
    this.enrollmentService.enroll(currentStudent.id, this.courseId).subscribe({
      next: () => {
        alert('✅ Successfully enrolled in the course!');
      },
      error: (error) => {
        if (error.status === 409) {
          alert('You are already enrolled in this course.');
        } else {
          console.error('Enrollment failed:', error);
          alert('An error occurred during enrollment.');
        }
      }
    });
  }
    
}
