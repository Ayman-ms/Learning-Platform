import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { StudentsService } from 'src/app/services/students/students.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  studentToEdit: Student = {
    id: '', firstName: '', password: '', email: '', phone: '',
    lastName: '',
    photoPath: '',
    createdAt: '',
    roll: ''
  };

  // input status
  isFirstNameDisabled = true;
  isLastNameDisabled = true;
  isPasswordDisabled = true;
  isEmailDisabled = true;
  isPhoneDisabled = true;
  isLoading = false;
  errorMessage = '';
  imagePreview: SafeUrl | null = null;
  isSubmitting = false;
  selectedFile: File | null = null;

  // user
  studentLoggedIn = false;
  studentForm = new FormGroup({
    firstName: new FormControl(this.studentToEdit.firstName, Validators.required),
    lastName: new FormControl(this.studentToEdit.lastName, Validators.required),
    phone: new FormControl(this.studentToEdit.phone, Validators.required),
    password: new FormControl(this.studentToEdit.password, [
      Validators.minLength(6),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$"),
      Validators.required
    ]),
    email: new FormControl(this.studentToEdit.email, [Validators.required, Validators.email]),
    photoBase64: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private studentsService: StudentsService,
    public accountService: SessionService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,

  ) {
    accountService.user.subscribe((u) => {
      this.studentLoggedIn = u && u.firstName !== 'anonymos';
    });
  }


  ngOnInit(): void {
    this.httpClient.get<Array<Student>>('http://localhost:5270/api/Student').subscribe((userListItems) => {
      this.route.queryParams.subscribe(params => {
        for (let user of userListItems) {
          if (user.id == params['id']) {
            this.studentToEdit = user;
            this.studentForm.patchValue(user);
            break;
          }
        }
      });
    });
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
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress with 70% quality
      };
    });
  }

  selectedImage: string | ArrayBuffer | null = null;
  photoBase64: string = '';

  onSubmit() {
    if (this.studentForm.invalid) {
      return;
    }
  
    this.isSubmitting = true;
    const formValues = this.studentForm.value;
  
    const studentToUpdate: Student = {
      id: this.studentToEdit.id,
      firstName: formValues.firstName ?? '',
      lastName: formValues.lastName ?? '',
      email: formValues.email ?? '',
      phone: formValues.phone ?? '',
      password: formValues.password || this.studentToEdit.password,
      createdAt: this.studentToEdit.createdAt,
      photoPath: this.studentToEdit.photoPath,
      roll: this.studentToEdit.roll
    };
  
    this.studentsService.updateStudent(studentToUpdate, this.selectedFile?? undefined)
      .then((success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Student updated successfully'
          });
          this.router.navigate(['/admin/students']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update student'
          });
        }
        this.isSubmitting = false;
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while updating the student'
        });
        this.isSubmitting = false;
      });
  }
  
  
  // Updated file selection logic
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          this.selectedImage = result;
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(result as string);
        }
      };
  
      reader.readAsDataURL(this.selectedFile);
    }
  }
  

  generateRandomPassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.studentForm.patchValue({ password });
  }

  msgs = new Array<Message>();

  clickMessage() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'User edited' });
  }
  getImageSource(photoBase64: string | undefined): string {
    if (!photoBase64 || photoBase64.trim() === '' || photoBase64 === 'undefined' || photoBase64 === 'null') {
      return 'assets/default-profile.png'; // Default image
    }

    // Determine image format
    let imageFormat = "jpeg"; // Default
    if (photoBase64.startsWith("iVBORw0KGgo")) {
      imageFormat = "png"; // PNG format
    }

    return `data:image/${imageFormat};base64,${photoBase64.trim()}`;
  }

  async deleteStudent(id:string){
    let result = await this.studentsService.deleteStudent(id)
    this.router.navigate(['/admin/students'])
  }

  getImagePath(imageFileName: string | undefined): string {
    if (!imageFileName || imageFileName.trim() === '') {
      return 'assets/default-profile.png';
    }
    const unique = new Date().getTime(); 
    return `${imageFileName}`;
  }
  hasError(controlName: string, errorName: string): boolean {
    const control = this.studentForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.touched || control.dirty);
  }

  onCancel() {
    this.router.navigateByUrl('admin/students');
  }
}