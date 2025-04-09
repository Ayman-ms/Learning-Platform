import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Teacher } from 'src/app/models/teacher';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategory } from 'src/app/models/subCategory';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  loading = false;
  courseForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  teachers: Teacher[] = [];
  mainCategories: MainCategory[] = [];
  subCategories: SubCategory[] = [];
  dropdownSettings: IDropdownSettings = {};
  selectedMainCategory: MainCategory | null = null;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private mainCategoryService: MainCategoryService,
    private subCategoryService: SubCategoryService,
    private coursesService: CoursesService
  ) { }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'description',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.teacherService.getTeachers().subscribe(teachers => this.teachers = teachers);
    this.mainCategoryService.getMainCategories().then(mainCategories => this.mainCategories = mainCategories);
    this.subCategoryService.getSubCategories().then(subCategories => {
      this.subCategories = subCategories;
      console.log('Loaded subcategories:', this.subCategories); // للتأكد من تحميل البيانات
    });

    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      description: ['', Validators.required],
      status: [false],
      teacher: ['', Validators.required],
      mainCategory: ['', Validators.required],
      subCategories: [[], Validators.required]
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
      reader.onload = (e) => this.selectedImage = e.target?.result ?? null;
      reader.readAsDataURL(file);
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.courseForm.get(fieldName);
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'This field is required.';
      if (control.errors?.['minlength']) return `Must be at least ${control.errors?.['minlength'].requiredLength} characters.`;
      if (control.errors?.['pattern']) return 'Invalid format.';
    }
    return '';
  }

  onSubCategorySelect(item: any) {
    console.log('Selected item:', item); // للتأكد من القيم المختارة
    const currentSelections = this.courseForm.get('subCategories')?.value || [];
    const newSelection = {
      description: item.description
    };

    if (!currentSelections.some((selected: any) => selected.description === item.description)) {
      currentSelections.push(newSelection);
      this.courseForm.patchValue({ subCategories: currentSelections });
    }
  }


  onSubCategoryDeSelect(item: any) {
    let currentSelections = this.courseForm.get('subCategories')?.value || [];
    currentSelections = currentSelections.filter(
      (selected: any) => selected.description !== item.description
    );
    this.courseForm.patchValue({ subCategories: currentSelections });
  }
  onSelectAllSubCategories(items: any[]) {
    this.courseForm.patchValue({ subCategories: items });
  }

  onDeSelectAllSubCategories() {
    this.courseForm.patchValue({ subCategories: [] });
  }
  onMainCategoryChange(event: any) {
    const selectedDescription = event.target.value;
    this.selectedMainCategory = this.mainCategories.find(
      cat => cat.description === selectedDescription
    ) || null;
  }
  onSubmit() {
    if (this.courseForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('courseName', this.courseForm.value.courseName);
    formData.append('description', this.courseForm.value.description);

    // ✅ تحويل `status` إلى `true` أو `false` كنص منطقي
    formData.append('status', this.courseForm.value.status ? 'true' : 'false');

    formData.append('teacher', this.courseForm.value.teacher);
    formData.append('mainCategory', this.courseForm.value.mainCategory);
    const subCategoriesArray = this.courseForm.value.subCategories.map((item: any) => {
      const subCategory = this.subCategories.find(subCat => subCat.id === item.id); // تعديل هنا للسحب
      return subCategory; // إرجاع الكائن الكامل بدلاً من المعرف فقط
    });
    formData.append('subCategories', JSON.stringify(subCategoriesArray));


    if (this.selectedFile) {
      formData.append("photo", this.selectedFile, this.selectedFile.name);
    }

    this.coursesService.addCourse(formData).subscribe({
      next: () => {
        this.successMessage = 'Course created successfully!';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error creating course. Please try again.';
        this.loading = false;
        console.error('API Error:', err);
      }
    });
  }

}
