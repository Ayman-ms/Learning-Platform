import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from 'src/app/services/students/students.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup;
  selectedFile: File | null = null;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private studentService: StudentsService, private router: Router) {
    this.registrationForm = this.fb.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      phoneControl: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      photoBase64: [''],
      passwordControl: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.selectedImage = e.target.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit() {
    console.log('onSubmit called');
    if (this.registrationForm.invalid) {
      console.log('Form is invalid');
      this.registrationForm.markAllAsTouched();
      alert("Please fill all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.registrationForm.get('firstNameControl')?.value);
    formData.append('lastName', this.registrationForm.get('lastNameControl')?.value);
    formData.append('phone', this.registrationForm.get('phoneControl')?.value);
    formData.append('email', this.registrationForm.get('emailControl')?.value);
    formData.append('password', this.registrationForm.get('passwordControl')?.value);

    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile, this.selectedFile.name);
    }

    console.log('Form Data:', formData);

    this.studentService.registerStudent(formData).subscribe(
      response => {
        console.log('User registered successfully!', response);
        this.router.navigate(['']);
      },
      error => {
        console.error('Error registering user:', error);
      }
    );
  }
}

