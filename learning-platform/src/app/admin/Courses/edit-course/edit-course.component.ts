import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { Course } from 'src/app/models/courses';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { SessionService } from 'src/app/services/session/session.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { SubCategory } from 'src/app/models/subCategory';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  coursesToEdit: Course = {
    id: '', name: '', description: '', status: '', teacher: '',
    time: '', photoPath: '', mainCategory: '', subCategories: []
  };
  courseId!: string;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;
  courseForm!: FormGroup;
  subCategories: SubCategory[] = []; // قائمة الفئات الفرعية
  teachers: any[] = []; // قائمة المدرسين 
  mainCategories: MainCategory[] = [];
  dropdownSettings: IDropdownSettings = {};
  
  getImagePath(imageFilePath: string | undefined): string {
    if (!imageFilePath || imageFilePath.trim() === '') {
      return 'assets/default-profile.png'; // صورة افتراضية
    }
    return `http://localhost:5270${imageFilePath}`; // تأكد من ربط الصورة بالسيرفر
  }

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private httpClient: HttpClient,
      private courseService: CoursesService,
      public accountService: SessionService,
      private messageService: MessageService,
      private fb: FormBuilder,    
      private sanitizer: DomSanitizer,
      private teacherService: TeacherService,
      private mainCategoryService: MainCategoryService,  
      private subCategoryService: SubCategoryService
   )     { }
  
    courseList?: Array<Course>;
  
    ngOnInit(): void {
      // إنشاء نموذج التعديل
      this.courseForm = this.fb.group({
        name: ['', Validators.required],
        teacher: ['', Validators.required],
        description: ['', Validators.required],
        mainCategory: ['', Validators.required],
        subCategories: [[], Validators.required], // إضافة الحقل subCategories كقائمة
        status: [false, Validators.required],
        time: [0]
      });
  
      // إعدادات ng-multiselect-dropdown
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'description',
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        itemsShowLimit: 5,
        allowSearchFilter: true
      };
  
      // تحميل المدرسين
      this.teacherService.getTeachers().subscribe(teachers => {
        this.teachers = teachers;
        console.log('Loaded teachers:', this.teachers); // للتأكد من تحميل المدرسين
      });
  
      // تحميل الفئات الرئيسية
      this.mainCategoryService.getMainCategories().then(mainCategories => {
        this.mainCategories = mainCategories;
        console.log('Loaded main categories:', this.mainCategories); // للتأكد من تحميل الفئات الرئيسية
      });
  
      // تحميل الفئات الفرعية
      this.subCategoryService.getSubCategories().then(subCategories => {
        this.subCategories = subCategories;
        console.log('Loaded subcategories:', this.subCategories); // للتأكد من تحميل الفئات الفرعية
      });
  
      // تحميل بيانات الكورس
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
  
            // تهيئة النموذج بالقيم المخزنة مسبقًا
            this.courseForm.patchValue({
              name: course.name,
              description: course.description,
              teacher: course.teacher,
              mainCategory: course.mainCategory,
              subCategory: course.subCategories,
              status: course.status,
              time: course.time
            });
  
            // ضبط القيم المختارة في Sub Categories
            this.subCategories = this.subCategories.filter(subCategory =>
              course.subCategories.includes(subCategory.id)
            );
  
            // استخدام getImagePath لمعالجة مسار الصورة
            this.imagePreview = this.getImagePath(course.photoPath);
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
          subCategories: formValues.subCategories,
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
  
    // معالجة اختيار Sub Category
    onSubCategorySelect(event: any): void {
      const selectedIds = this.subCategories.map(subCategory => subCategory.id);
      if (!selectedIds.includes(event.id)) {
        this.subCategories.push(event);
      }
    }
  
    // معالجة إلغاء اختيار Sub Category
    onSubCategoryDeselect(event: any): void {
      this.subCategories = this.subCategories.filter(subCategory => subCategory.id !== event.id);
    }
  }
  