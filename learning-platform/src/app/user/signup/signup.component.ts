import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from 'src/app/services/students/students.service';
import { Student } from 'src/app/models/student';
import { AvatarService } from 'src/app/services/avatar/avatar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null; // لعرض الصورة
  photoBase64: string = ''; // خاصية لتخزين الصورة بصيغة Base64

  constructor(private fb: FormBuilder, private studentService: StudentsService, private router: Router) {
    // إعداد النموذج للتسجيل
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
  // confige between password and config password
  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('passwordControl')?.value;
    const confirmPassword = form.get('confirmPasswordControl')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  ngOnInit(): void {}

  // image proccess
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
        this.photoBase64 = this.selectedImage.split(',')[1];
        this.registrationForm.patchValue({ photoBase64: this.photoBase64 }); 
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  // Model sending the form
  onSubmit() {
    console.log('Form Data:', this.registrationForm.value);
    if (this.registrationForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.registrationForm.get('firstNameControl')?.value);
      formData.append('lastName', this.registrationForm.get('lastNameControl')?.value);
      formData.append('phone', this.registrationForm.get('phoneControl')?.value);
      formData.append('email', this.registrationForm.get('emailControl')?.value);
      formData.append('password', this.registrationForm.get('passwordControl')?.value);
      formData.append('photoBase64', this.photoBase64);
  
      console.log('Form Data:', formData); // تحقق من البيانات هنا
  
      this.studentService.registerStudent(formData).subscribe(response => {
        console.log('User registered successfully!', response);
        this.router.navigate(['/students']);
      }, error => {
        console.error('Error registering user:', error);
      });
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
  
  
  
}




