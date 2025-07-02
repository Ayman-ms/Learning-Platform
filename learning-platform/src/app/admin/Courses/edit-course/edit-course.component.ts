import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SafeUrl } from '@angular/platform-browser';
import { Course } from 'src/app/models/courses';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategory } from 'src/app/models/subCategory';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';
import { ImageService } from 'src/app/services/image/image.service';
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  // Form related
  courseForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  // Course data
  courseId!: string;
  coursesToEdit: Course = {
    id: '',
    name: '',
    description: '',
    status: false,
    teacher: '',
    photoPath: '',
    mainCategory: '',
    subCategories: [],
    rating: 5,
    startDate: '',
    duration: ''
  };

  teachers: any[] = [];
  mainCategories: MainCategory[] = [];
  availableSubCategories: SubCategory[] = [];
  selectedSubCategories: SubCategory[] = [];

  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private courseService: CoursesService,
    private teacherService: TeacherService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      teacher: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      mainCategory: ['', Validators.required],
      subCategories: [[], Validators.required],
      status: ['', Validators.required],
      time: [0],
      startDate: [''],
      duration: ['']
    });
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      const [teachers, mainCategories, subCategories] = await Promise.all([
        this.teacherService.getTeachers().toPromise(),
        this.mainCategoryService.getMainCategories(),
        this.subCategoryService.getSubCategories()
      ]);

      this.teachers = teachers || [];
      this.mainCategories = mainCategories;
      this.availableSubCategories = subCategories;

      // Load course data if editing
      const courseId = this.route.snapshot.paramMap.get('id');
      if (courseId) {
        this.courseId = courseId;
        await this.loadCourseData();
      }
    } catch (error) {
      this.handleError('Failed to load initial data', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadCourseData(): Promise<void> {
    try {
      const course = await this.courseService.getCourseById(this.courseId).toPromise();
      if (course) {
        this.coursesToEdit = course;

        if (course.subCategories && course.subCategories.length > 0) {
          const selectedSubCategories = this.availableSubCategories.filter(
            subCat => course.subCategories.includes(subCat.description)
          );

          this.courseForm.patchValue({
            name: course.name,
            description: course.description,
            teacher: course.teacher,
            mainCategory: course.mainCategory,
            subCategories: selectedSubCategories,
            status: course.status,
            startDate: course.startDate ?? '',
            duration: course.duration ?? ''
          });
        }

        this.imagePreview = this.imageService.getImagePath(course.photoPath, 'assets/courseImage.svg');
      }
    } catch (error) {
      this.handleError('Failed to load course data', error);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.createImagePreview(this.selectedFile);
    }
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.courseForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  async onSubmit(): Promise<void> {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    try {
      this.isSubmitting = true;
      const formValues = this.courseForm.value;
      const formData = new FormData();
      formData.append('id', this.courseId);
      formData.append('name', formValues.name);
      formData.append('description', formValues.description);
      formData.append('teacher', formValues.teacher);
      formData.append('mainCategory', formValues.mainCategory);
      formData.append('status', formValues.status.toString());
      formData.append('startDate', formValues.startDate || '');
      formData.append('duration', formValues.duration || '');

      if (formValues.subCategories && formValues.subCategories.length > 0) {
        formValues.subCategories.forEach((subCat: any) => {
          formData.append('subCategories[]', subCat.description);
        });
      }

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }
      const response = await this.courseService.updateCourseWithImage(this.courseId, formData).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Course updated successfully!'
      });

      this.router.navigate(['/admin/courses']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update course'
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || message
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/courses']);
  }
}