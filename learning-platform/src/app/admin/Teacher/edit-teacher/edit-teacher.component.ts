import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher/teacher.service'; 
import { Teacher } from 'src/app/models/teacher'; 
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class TeacherEditComponent implements OnInit {
  teacherForm!: FormGroup;
  teacherId!: string;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // إنشاء نموذج التعديل
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required], password: ['']
      // Password غير مطلوب عند التعديل
      // password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")]],
    });

    // استخراج معرف المدرس من عنوان URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.teacherId = idParam;
      this.loadTeacherData();
    } else {
      this.errorMessage = 'معرف المدرس غير موجود';
    }
  }

  // تحميل بيانات المدرس الحالية
  loadTeacherData(): void {
    this.isLoading = true;
    this.teacherService.getTeacher(this.teacherId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'حدث خطأ أثناء تحميل بيانات المدرس';
          console.error('Error loading teacher:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(teacher => {
        if (teacher) {
          // تعبئة النموذج بالبيانات الحالية
          this.teacherForm.patchValue({
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            phone: teacher.phone
            // لا نقوم بتعبئة كلمة المرور لأسباب أمنية
          });
          
          if (teacher.profileImage) {
            this.imagePreview = teacher.profileImage;
          }
        }
      });
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
    const control = this.teacherForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }


  generateRandomPassword(): void {
    const length = 10; // يمكنك تعديل الطول حسب الحاجة
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
  
    const allChars = uppercase + lowercase + numbers + specialChars;
  
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    // ترتيب عشوائي للحروف لتجنب النمط الثابت
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
    // تحديث قيمة كلمة المرور في الحقل
    this.teacherForm.patchValue({ password });
  
    // إظهار كلمة المرور عند توليدها
    this.isPasswordVisible = true;
  }
  
  

  // إرسال النموذج
// تعديل جزء onSubmit فقط من المكون
onSubmit(): void {
  if (this.teacherForm.invalid) {
    Object.keys(this.teacherForm.controls).forEach(key => {
      const control = this.teacherForm.get(key);
      control?.markAsTouched();
    });
    return;
  }

  this.isSubmitting = true;
  const formData = new FormData();
  const formValue = this.teacherForm.value;

  // ✅ إرسال القيم حتى لو كانت فارغة لتجنب الخطأ 400
  formData.append('FirstName', formValue.firstName || '');
  formData.append('LastName', formValue.lastName || '');
  formData.append('Email', formValue.email || '');
  formData.append('Phone', formValue.phone || '');

  // ✅ لا ترسل كلمة المرور إذا لم يتم تعديلها
  if (formValue.password && formValue.password.trim()) {
    formData.append('Password', formValue.password);
  }

  // ✅ تحقق مما إذا كانت هناك صورة جديدة وأضفها إلى FormData
  if (this.selectedFile) {
    formData.append('imageFile', this.selectedFile);
  }

  // ✅ طباعة `FormData` لفحص القيم المرسلة
  console.log('🚀 Sending FormData:');
  for (const pair of (formData as any).entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  this.teacherService.updateTeacherWithFormData(this.teacherId, formData)
    .pipe(
      catchError(error => {
        this.errorMessage = 'حدث خطأ أثناء تحديث بيانات المدرس: ' + (error.error?.message || error.message);
        console.error('❌ Error updating teacher:', error);
        return of(null);
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    )
    .subscribe(response => {
      if (response) {
        console.log('✅ Teacher updated successfully:', response);
        this.router.navigate(['/admin/teachers']);
      }
    });
}

  // إلغاء عملية التعديل
  onCancel(): void {
    this.router.navigate(['/admin/teachers']);
  }
}