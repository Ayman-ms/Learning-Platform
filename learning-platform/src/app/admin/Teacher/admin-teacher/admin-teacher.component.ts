import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
   
  getImagePath(imageFileName: string | undefined): string {
    if (!imageFileName || imageFileName.trim() === '') {
      return 'assets/default-profile.png';
    }  
    return `${imageFileName}`;
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


  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTeachers = this.filteredTeachers.slice(startIndex, endIndex);

    this.paginatedRows = [];
    for (let i = 0; i < this.paginatedTeachers.length; i += 3) {
      this.paginatedRows.push(this.paginatedTeachers.slice(i, i + 3));
    }
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredTeachers.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
