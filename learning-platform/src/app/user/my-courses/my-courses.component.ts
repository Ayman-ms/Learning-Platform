import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { SessionService } from 'src/app/services/session/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit{
  enrolledCourses: any[] = [];

  constructor(
    private enrollmentService: EnrollmentService,
    private coursesService: CoursesService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const currentStudent = this.sessionService.getUser();
    if (!currentStudent || !currentStudent.id) {
      alert('You must be logged in to view your courses.');
      return;
    }

    this.enrollmentService.getEnrollmentsByStudent(currentStudent.id).subscribe({
      next: (enrollments) => {
        const courseIds = enrollments.map(e => e.courseId);

        this.coursesService.getCourses().subscribe(courses => {
          this.enrolledCourses = courses.filter(c => courseIds.includes(c.id));
        });
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
      }
    });
  }
}
