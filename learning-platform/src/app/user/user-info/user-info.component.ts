import { Component, OnInit } from '@angular/core';
// import { UserService } from 'src/app/services/users/user.service';
import { UserService } from 'src/app/services/users/user.service';
import { Student } from 'src/app/models/student';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  studentForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  imagePreview: string | null = null;
  currentStudent: Student | null = null;
  selectedFile: File | null = null; 
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''], // optional
      photoPath: ['']
    });
  }

  ngOnInit() {
    this.loadStudentData();
  }

  loadStudentData() {
    this.isLoading = true;
    const currentUser = this.sessionService.getUser();
  
    if (!currentUser || !currentUser.id) {
      this.isLoading = false;
      this.errorMessage = 'User data not found';
      this.router.navigate(['/login']);
      return;
    }
  
    this.userService.getStudentById(currentUser.id).subscribe({
      next: (student: Student) => {
        this.currentStudent = student;
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          photoPath: student.photoPath || '/assets/images/default-avatar.png'
        });
        this.imagePreview = student.photoPath || '/assets/images/default-avatar.png';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading student data:', err);
        this.errorMessage = 'Failed to load student data';
        this.isLoading = false;
      }
    });
  }
  
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
  
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
        this.studentForm.patchValue({ photoPath: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }
  

  onSubmit() {
    if (this.studentForm.valid && this.currentStudent?.id) {
      this.isSubmitting = true;
  
      const formData = new FormData();
      formData.append('firstName', this.studentForm.get('firstName')?.value);
      formData.append('lastName', this.studentForm.get('lastName')?.value);
      formData.append('email', this.studentForm.get('email')?.value);
      formData.append('phone', this.studentForm.get('phone')?.value);
  
      const password = this.studentForm.get('password')?.value;
      if (password) {
        formData.append('password', password);
      }
  
      if (this.selectedFile) {
        formData.append('Photo', this.selectedFile, this.selectedFile.name);
      }
  
      this.userService.updateStudent(this.currentStudent.id, formData).subscribe({
        next: (response) => {
          this.sessionService.setCurrentUser(response);
          this.router.navigate(['update/info']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update profile';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.studentForm.markAllAsTouched();
      this.errorMessage = 'Please fill in the required fields correctly';
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.studentForm.get(field);
    return control?.touched && control?.hasError(error) || false;
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}
