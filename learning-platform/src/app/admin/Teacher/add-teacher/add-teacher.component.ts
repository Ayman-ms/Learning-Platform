import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {

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

      console.log('📌 Image selected :', file.name);
    }
  }


  // onSubmit(): void {
  //   // Reset messages
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   if (this.registrationForm.valid) {
  //     this.loading = true;

  //     // FormData
  //     const formData = new FormData();

  //     // Add form data
  //     formData.append('FirstName', this.registrationForm.get('firstName')?.value);
  //     formData.append('LastName', this.registrationForm.get('lastName')?.value);
  //     formData.append('Email', this.registrationForm.get('email')?.value);
  //     formData.append('Phone', this.registrationForm.get('phone')?.value);
  //     formData.append('Password', this.registrationForm.get('password')?.value);

  //     // add image
  //     if (this.selectedFile) {
  //       formData.append('imageFile', this.selectedFile);
  //     }

  //     // Print the data sent for verification
  //     console.log('📌 Data to be sent:');
  //     formData.forEach((value, key) => {
  //       if (key !== 'imageFile') {
  //         console.log(`${key}:`, value);
  //       } else {
  //         console.log(`${key}: [file]`);
  //       }
  //     });

  //     this.teacherService.registerTeacher(formData).subscribe({
  //       next: (response) => {
  //         this.successMessage = 'Teacher registered successfully!';
  //         this.loading = false;

  //         this.registrationForm.reset();
  //         this.selectedImage = null;
  //         this.selectedFile = null;
  //         // this.router.navigate(['/teachers']);
  //       },
  //       error: (error) => {
  //         this.errorMessage = error.message || 'An error occurred while registering the teacher';
  //         this.loading = false;
  //       }
  //     });
  //   } else {
  //     this.markFormGroupTouched(this.registrationForm);
  //     this.errorMessage = 'Please correct errors in the form before submitting';
  //   }
  // }

  // Mark all form fields as "touched" to display error messages
  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;

      const formData = new FormData();

      // إضافة بيانات المعلم
      Object.keys(this.registrationForm.value).forEach(key => {
        formData.append(key, this.registrationForm.get(key)?.value);
      });

      // إضافة الصورة
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile); // تأكد من أن الاسم 'photo' يطابق البارامتر في Backend
      }

      this.teacherService.registerTeacher(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Teacher registered successfully!';
          this.loading = false;
          this.registrationForm.reset();
          this.selectedImage = null;
          this.selectedFile = null;
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred while registering the teacher';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registrationForm);
      this.errorMessage = 'Please correct errors in the form before submitting';
    }
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

  }
  // Validation error handlers to display in the UI
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
}