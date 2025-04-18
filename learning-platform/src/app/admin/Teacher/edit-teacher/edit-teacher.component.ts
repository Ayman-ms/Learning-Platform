import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { Teacher } from 'src/app/models/teacher';
import { catchError, finalize, of } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { PasswordService } from 'src/app/services/password/password.service';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class TeacherEditComponent implements OnInit, OnDestroy {
  teacherForm!: FormGroup;
  teacherId!: string;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;
  private objectUrl: string | null = null;
  isPasswordVisible: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  photoBase64: string = '';

  private apiUrl = 'http://localhost:5270/api'; // تأكد من تحديث هذا حسب إعدادات API الخاص بك

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private passwordService: PasswordService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadTeacherData();
  }

  private initForm(): void {
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.teacherId = idParam;
    } else {
      this.errorMessage = 'Teacher ID not found';
      this.router.navigate(['/admin/teachers']);
    }
  }

  loadTeacherData(): void {
    if (!this.teacherId) return;

    this.isLoading = true;
    this.teacherService.getTeacher(this.teacherId).subscribe(
      (teacher) => {
        if (teacher) {
          this.teacherForm.patchValue({
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            phone: teacher.phone
          });

          if (teacher.profileImage) {
            // تأكد من أن المسار هو URL كامل
            this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(teacher.profileImage);
          } else {
            this.imagePreview = 'assets/default-profile.png'; // صورة افتراضية
          }
        }
      },
      (error) => {
        this.errorMessage = 'Error loading teacher data';
        console.error('Error:', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  async compressImage(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // ضغط بجودة 70%
      };
    });
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file; // تأكد من تعيين الملف المرفوع
      const reader = new FileReader();

      reader.onload = async (e) => {
        const originalBase64 = e.target?.result as string;
        const compressedBase64 = await this.compressImage(originalBase64);
        this.selectedImage = compressedBase64;
        this.photoBase64 = compressedBase64.split(',')[1];
        this.teacherForm.patchValue({ photoBase64: this.photoBase64 });

        // تحديث الصورة المعروضة
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
      };

      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
   
  getImagePath(imageData: string | undefined): string {
    if (!imageData) {
      return 'assets/default-profile.png';
    }
    
    // التحقق مما إذا كانت الصورة بتنسيق Base64
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
    
    // التحقق مما إذا كانت الصورة بتنسيق Base64 بدون prefix
    if (this.isBase64(imageData)) {
      return `data:image/jpeg;base64,${imageData}`;
    }
    
    return imageData;
  }
  private isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  generateRandomPassword(): void {
    const generatedPassword = this.passwordService.generateRandomPassword();
    this.teacherForm.patchValue({ password: generatedPassword });
    this.isPasswordVisible = true;
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) {
      Object.keys(this.teacherForm.controls).forEach(key => {
        const control = this.teacherForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.teacherForm.value;

    // إعداد البيانات كـ FormData
    const formData = new FormData();

    // إضافة الحقول فقط إذا تم تعديلها أو إرسال القيم الحالية
    formData.append('FirstName', formValue.firstName || '');
    formData.append('LastName', formValue.lastName || '');
    formData.append('Email', formValue.email || '');
    formData.append('Phone', formValue.phone || '');

    // إذا لم يتم إدخال كلمة مرور جديدة، أرسل كلمة المرور الحالية
    if (formValue.password) {
      formData.append('Password', formValue.password);
    } else {
      formData.append('Password', ''); // إرسال كلمة مرور فارغة إذا لم يتم تعديلها
    }

    // إذا لم يتم اختيار صورة جديدة، أرسل الصورة الحالية
    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
    } else if (this.imagePreview) {
      const currentPhotoUrl = this.imagePreview.toString();
      const photoFileName = currentPhotoUrl.substring(currentPhotoUrl.lastIndexOf('/') + 1);
      formData.append('Photo', photoFileName); // إرسال اسم الصورة الحالية
    } else {
      formData.append('Photo', ''); // إرسال قيمة فارغة إذا لم يتم تعديل الصورة
    }

    // سجل الحقول المرسلة
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.teacherService.updateTeacher(this.teacherId, formData).subscribe({
      next: () => {
        console.log('Teacher updated successfully');
        this.router.navigate(['/admin/teachers']);
      },
      error: (error) => {
        this.errorMessage = 'Error updating teacher: ' + (error.error?.title || error.message);
        console.error('Error details:', error.error);

        // عرض تفاصيل الأخطاء القادمة من الباك اند
        if (error.error?.errors) {
          Object.entries(error.error.errors).forEach(([field, messages]) => {
            console.error(`Validation error in ${field}:`, messages);
          });
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.teacherForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  onCancel(): void {
    this.router.navigate(['/admin/teachers']);
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }
}