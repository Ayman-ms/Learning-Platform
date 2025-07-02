import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageService } from 'src/app/services/image/image.service';
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
    public imageService: ImageService,
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
          course.subCategories = course.subCategories?.filter(subCat => subCat !== null) || [];
          return course;
        });
        this.filteredCourses = [...this.coursessList];
        this.updateSearch();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  hasSubCategories(course: Course): boolean {
    return Array.isArray(course.subCategories) && course.subCategories.length > 0;
  }

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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
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
      alert('Error while adding the course.');
    }
  }

  async deleteUserClick(id: string | undefined) {
    if (!id) {
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
