import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminCoursesComponent {
  courseForm: FormGroup;
  selectedImage: File | null = null;
  previewImage: string | null = null;
  userLoggedIn = false;
  coursessList: Array<Course> = [];
  filteredCourses: Array<Course> = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedCourses: Array<Course> = [];
  searchText: string = '';
  paginatedRows: Array<Array<Course>> = [];

  constructor(private fb: FormBuilder, private coursesService: CoursesService, 
    private messageService: MessageService) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      teacherID: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.coursessList = courses.map(course => {
          // تصفية القيم null من subCategories
          course.subCategories = course.subCategories?.filter(subCat => subCat !== null) || [];
          return course;
        });
        console.log('Courses loaded:', this.coursessList); // تأكد من أن Sub Categories موجودة
        this.filteredCourses = [...this.coursessList];
        this.updateSearch();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  // دالة مساعدة للتحقق من وجود تصنيفات فرعية
  hasSubCategories(course: Course): boolean {
    return Array.isArray(course.subCategories) && course.subCategories.length > 0;
  }

  // دالة مساعدة للحصول على نص التصنيفات الفرعية
  getSubCategoriesText(course: Course): string {
    if (this.hasSubCategories(course)) {
      return course.subCategories.join(', ');
    }
    return 'No sub categories';
  }

  updateSearch() {
    this.filteredCourses = this.searchText
      ? this.coursessList.filter(course =>
          course.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          course.teacher.toLowerCase().includes(this.searchText.toLowerCase())
        )
      : [...this.coursessList];

    this.paginatedCourses = [...this.filteredCourses];
  }

  getSubCategoriesDisplay(course: Course): string {
    if (!course.subCategories || course.subCategories.length === 0) {
      return 'No sub categories';
    }
    return course.subCategories.join(', ');
  }

  onPaginatedData(event: Course[]) {
    this.paginatedCourses = event;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // العرض المسبق للصورة
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getImagePath(imageFilePath: string | undefined): string {
    if (!imageFilePath || imageFilePath.trim() === '') {
      return 'assets/default-profile.png'; // صورة افتراضية
    }
    return `http://localhost:5270${imageFilePath}`; // تأكد من ربط الصورة بالسيرفر
  }

  async onSubmit() {
    if (this.courseForm.invalid || !this.selectedImage) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.courseForm.value.name);
    formData.append('description', this.courseForm.value.description);
    formData.append('teacherID', this.courseForm.value.teacherID);
    formData.append('image', this.selectedImage);

    try {
      // await this.coursesService.addCourse(formData);
      alert('Course added successfully!');
      this.courseForm.reset();
      this.previewImage = null;
    } catch (error) {
      console.error(error);
      alert('Error while adding the course.');
    }
  }

  async deleteUserClick(id: string | undefined) {
    if (!id) {
      console.error("❌ Course ID is undefined, cannot delete.");
      return;
    }  
    let result = await this.coursesService.deleteCourse(id);

    if (result) {
      this.messageService.clear();
      this.messageService.add({ key: 'c', sticky: true, severity: 'error', summary: 'Are you sure?', detail: 'Confirm to proceed' });
      window.location.reload();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete course.' });
    }
  }
}
