import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

import { Course } from 'src/app/models/courses';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategory } from 'src/app/models/subCategory';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';

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
    status: '',
    teacher: '',
    time: '',
    photoPath: '',
    mainCategory: '',
    subCategories: []
  };

  // Lists for dropdowns
  teachers: any[] = [];
  mainCategories: MainCategory[] = [];
  availableSubCategories: SubCategory[] = [];
  selectedSubCategories: SubCategory[] = [];

  // Image handling
  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private courseService: CoursesService,
    private teacherService: TeacherService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService
  ) {}

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
      status: [true],
      time: [0]
    });
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;

      // Load all required data in parallel
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
      console.log('Loading course data...');
      const course = await this.courseService.getCourseById(this.courseId).toPromise();
      console.log('Loaded course:', course);
      console.log('Available subcategories:', this.availableSubCategories);
      
      if (course) {
        this.coursesToEdit = course;
        
        if (course.subCategories && course.subCategories.length > 0) {
          // تعديل طريقة الفلترة لتتطابق مع الـ description بدلاً من الـ id
          this.selectedSubCategories = this.availableSubCategories.filter(
            subCat => course.subCategories.includes(subCat.description)
          );
          
          console.log('Mapped selected subcategories:', this.selectedSubCategories);
          
          this.courseForm.patchValue({
            name: course.name,
            description: course.description,
            teacher: course.teacher,
            mainCategory: course.mainCategory,
            subCategories: this.selectedSubCategories,
            status: course.status === 'true',
            time: course.time
          });
        }
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

  getImagePath(path?: string): string {
    return path ? `http://localhost:5270${path}` : 'assets/default-profile.png';
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
      
      // تحويل الفئات الفرعية المختارة إلى مصفوفة من الـ IDs
      const subCategoryIds = formValues.subCategories.map((subCat: SubCategory) => subCat.id);

      const updatedCourse: Course = {
        ...this.coursesToEdit,
        name: formValues.name,
        description: formValues.description,
        teacher: formValues.teacher,
        mainCategory: formValues.mainCategory,
        subCategories: subCategoryIds, // استخدام مصفوفة الـ IDs
        status: formValues.status,
        time: formValues.time
      };

      // ... باقي كود الـ submit
    } catch (error) {
      this.handleError('Failed to update course', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private prepareUpdateData(): Course {
    const formValues = this.courseForm.value;
    return {
      ...this.coursesToEdit,
      name: formValues.name,
      description: formValues.description,
      teacher: formValues.teacher,
      mainCategory: formValues.mainCategory,
      subCategories: formValues.subCategories.map((sub: SubCategory) => sub.id),
      status: formValues.status,
      time: formValues.time
    };
  }

  private async updateCourseWithImage(course: Course): Promise<void> {
    const formData = new FormData();
    formData.append('imageFile', this.selectedFile!);
    Object.entries(course).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    await this.courseService.updateCourseWithImage(course.id, formData).toPromise();
  }

  private async updateCourseWithoutImage(course: Course): Promise<void> {
    await this.courseService.updateCourse(course.id, course).toPromise();
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
    console.error(message, error);
    this.errorMessage = message;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/courses']);
  }
}