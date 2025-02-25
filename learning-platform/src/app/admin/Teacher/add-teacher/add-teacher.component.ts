import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent implements OnInit {
  registrationForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  photoBase64: string = '';

  constructor(private fb: FormBuilder, private teacherService: TeacherService, private router: Router) {
    this.registrationForm = this.fb.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      phoneControl: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      photoBase64: [''],
      passwordControl: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")]],
      confirmPasswordControl: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('passwordControl')?.value;
    const confirmPassword = form.get('confirmPasswordControl')?.value;
    return password !== confirmPassword ? { passwordMismatch: true } : null;
  }

  // رفع صورة وتحويلها إلى Base64
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
        this.photoBase64 = this.selectedImage.split(',')[1]; // استخراج Base64
        this.registrationForm.patchValue({ photoBase64: this.photoBase64 });
      };

      reader.readAsDataURL(file);
    }
  }

  // إرسال البيانات
  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.registrationForm.get('firstNameControl')?.value);
      formData.append('lastName', this.registrationForm.get('lastNameControl')?.value);
      formData.append('phone', this.registrationForm.get('phoneControl')?.value);
      formData.append('email', this.registrationForm.get('emailControl')?.value);
      formData.append('password', this.registrationForm.get('passwordControl')?.value);
      
      // إضافة الصورة إذا كانت متوفرة
      if (this.photoBase64) {
        formData.append('photoBase64', this.photoBase64);
      }

      console.log('📤 إرسال البيانات:', formData);

      this.teacherService.registerTeacher(formData).subscribe(response => {
        console.log('✅ تم تسجيل المدرس بنجاح!', response);
        this.router.navigate(['/teachers']);
      }, error => {
        console.error('❌ فشل تسجيل المدرس:', error);
      });
    } else {
      alert("⚠️ الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح.");
    }
  }
}
