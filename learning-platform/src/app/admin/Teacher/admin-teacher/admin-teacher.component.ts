import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.css'],
  providers: [ConfirmationService, MessageService] // لإظهار رسائل الحذف والتأكيد
})
export class AdminTeacherComponent implements OnInit {
  teachersList: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  showAddTeacherForm: boolean = false;
  
  registrationForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  photoBase64: string = '';

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.registrationForm = this.fb.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      phoneControl: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      passwordControl: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")]],
      photoBase64: ['']
    });
  }

  async ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe(
        (teachers) => {
            this.teachersList = teachers;
            this.filteredTeachers = this.teachersList;
        },
        (error) => {
            console.error("❌ Error loading teachers:", error);
        }
    );
}

  updateSearch() {
    this.filteredTeachers = this.searchText
      ? this.teachersList.filter(t =>
          t.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          t.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          t.email.toLowerCase().includes(this.searchText.toLowerCase()))
      : this.teachersList;
  }

  toggleAddTeacherForm() {
    this.showAddTeacherForm = !this.showAddTeacherForm;
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
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  addTeacher() {
    // if (this.registrationForm.valid) {
    //   const teacherData = this.registrationForm.value;
    //   teacherData.photoBase64 = this.photoBase64;

    //   this.teacherService.registerTeacher(teacherData).subscribe(
    //     () => {
    //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Teacher added successfully!' });
    //       this.toggleAddTeacherForm();
    //       this.loadTeachers();
    //     },
    //     error => {
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add teacher.' });
    //       console.error('Error:', error);
    //     }
    //   );
    // }
  }

  confirmDeleteTeacher(teacherId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this teacher?',
      accept: () => {
        this.teacherService.deleteTeacher(teacherId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Teacher deleted successfully.' });
          this.loadTeachers();
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete teacher.' });
          console.error('Error:', error);
        });
      }
    });
  }
  getImagePath(imageFileName: string | undefined): string {
    if (!imageFileName || imageFileName.trim() === '') {
      console.warn("❌ لا توجد صورة، سيتم استخدام الصورة الافتراضية.");
      return 'assets/default-profile.png'; // صورة افتراضية عند عدم وجود صورة
    }
  
    return `${imageFileName}`; // تعديل المسار حسب مجلد الصور على السيرفر
  }
  
}
