import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { Course } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {
  coursesToEdit: Course = {
    id: '', name: '', description: '', status: false, teacher: '',
    time: 0, courseImage: '', mainCategory: '', subCategory: ''
  };
  courseId!: string;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  courseForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private courseService: CoursesService,
    public accountService: SessionService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) { }

  courseList?: Array<Course>;

  ngOnInit(): void {
    // إنشاء نموذج التعديل
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      teacher: ['', Validators.required],
      description: ['', Validators.required],
      mainCategory: ['', Validators.required],
      subCategory: ['', Validators.required],
      status: [false],
      time: [0]
    });
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = idParam;
      this.loadCourseData();
    } else {
      this.errorMessage = 'معرف المدرس غير موجود';
    }
  }

  // معالجة تحديد الصورة
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // التحقق من وجود أخطاء في حقل معين
  hasError(controlName: string, errorName: string): boolean {
    const control = this.courseForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  loadCourseData(): void {
    this.isLoading = true;
    this.courseService.getCourseById(this.courseId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'حدث خطأ أثناء تحميل بيانات الكورس';
          console.error('Error loading course:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(course => {
        if (course) {
          this.coursesToEdit = course;

          // تعبئة النموذج بالبيانات الحالية
          this.courseForm.patchValue({
            name: course.name,
            description: course.description,
            teacher: course.teacher,
            mainCategory: course.mainCategory,
            subCategory: course.subCategory,
            status: course.status,
            time: course.time
          });

          if (course.courseImage) {
            this.imagePreview = course.courseImage;
          }
        }
      });
  }

  async onSubmit() {
    if (this.courseForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.courseForm.controls).forEach(key => {
        this.courseForm.get(key)?.markAsTouched();
      });
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fix form errors' });
      return;
    }

    this.isSubmitting = true;

    try {
      // Update coursesToEdit with form values
      const formValues = this.courseForm.value;
      this.coursesToEdit = {
        ...this.coursesToEdit,
        name: formValues.name,
        description: formValues.description,
        teacher: formValues.teacher,
        mainCategory: formValues.mainCategory,
        subCategory: formValues.subCategory,
        status: formValues.status || this.coursesToEdit.status,
        time: formValues.time || this.coursesToEdit.time
      };

      // Handle image upload with FormData
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('imageFile', this.selectedFile);
        
        // Add all course properties to FormData
        Object.keys(this.coursesToEdit).forEach(key => {
          formData.append(key, (this.coursesToEdit as any)[key]);
        });
        
        // Use a specific method for updating with image
        let result = await this.courseService.updateCourseWithImage(this.coursesToEdit.id, formData).toPromise();
        if (result) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course edited with new image' });
          this.router.navigateByUrl('admin/courses');
        }
      } else {
        // Update without changing the image
        let result = await this.courseService.updateCourse(this.coursesToEdit.id, this.coursesToEdit).toPromise();
        if (result) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Course edited' });
          this.router.navigateByUrl('admin/courses');
        }
      }
    } catch (error) {
      console.error('Edit not successful', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Edit not successful' });
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/courses']);
  }
}