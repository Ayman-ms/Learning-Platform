import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminTeacherComponent implements OnInit {
  teachersList: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  showAddTeacherForm: boolean = false;
  
  paginatedTeachers: Array<Teacher> = [];
  paginatedRows: Array<Array<Teacher>> = [];
  
  registrationForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  photoBase64: string = '';

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder,
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

  updateSearch() {
    this.filteredTeachers = this.searchText
      ? this.teachersList.filter(teacher =>
          teacher.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          teacher.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          teacher.email.toLowerCase().includes(this.searchText.toLowerCase())
        )
      : [...this.teachersList];

    this.paginatedTeachers = [...this.filteredTeachers]; // إعادة ضبط البيانات للـ pagination
  }

  onPaginatedData(event: Teacher[]) {
    this.paginatedTeachers = event;
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

  toggleAddTeacherForm() {
    this.showAddTeacherForm = !this.showAddTeacherForm;
  }

  async compressImage(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // تحديد الأبعاد المطلوبة
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
      const reader = new FileReader();

      reader.onload = async (e) => {
        const originalBase64 = e.target?.result as string;
        const compressedBase64 = await this.compressImage(originalBase64);
        this.selectedImage = compressedBase64;
        this.photoBase64 = compressedBase64.split(',')[1];
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
  
  async deleteUserClick(id: string | undefined) {
    if (!id) {
      console.error("❌ Teacher ID is undefined, cannot delete.");
      return;
    }  
    let result = await this.teacherService.deleteTeacher(id);

    if (result) {
      this.loadTeachers();
      this.messageService.clear();
      this.messageService.add({ key: 'c', sticky: true, severity: 'error', summary: 'Are you sure?', detail: 'Confirm to proceed' });
      window.location.reload()
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete teacher.' });
    }
  }


}
