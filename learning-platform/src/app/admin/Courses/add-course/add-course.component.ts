import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategory } from 'src/app/models/subCategory';
@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  registrationForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  teachers: Teacher[] = [];
  mainCategory: MainCategory[] = [];
  subCategory: SubCategory[] = [];


  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService : SubCategoryService
  ) { }

  ngOnInit(): void {
    
    this.registrationForm = this.fb.group({
      courseName: ['', Validators.required],
      teacher: ['', Validators.required]
    });

    this.teacherService.getTeachers().subscribe(teachers => {
      this.teachers = teachers;
    });
    this.mainCategoryService.getMainCategories().then(mainCategories => {
      this.mainCategory = mainCategories;
    });
    this.subCategoryService.getSubCategories().then(subCategories => {
      this.subCategory = subCategories;

    });

  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);

      console.log('📌 Image selected:', file.name);
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) {
        return 'This field is required.';
      }
      if (control.errors?.['email']) {
        return 'Please enter a valid email';
      }
      if (control.errors?.['minlength']) {
        return `This field must contain at least ${control.errors?.['minlength'].requiredLength} characters`;
      }
      if (control.errors?.['pattern']) {
        return 'The entered value is invalid';
      }
    }
    return '';
  }


  onSubmit() { }
}
