import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.css']
})
export class AdminTeacherComponent {
  TeachersList: Array<Teacher> = [];
  filteredTeachers: Array<Teacher> = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedTeachers: Array<Teacher> = [];
  searchText: string = '';
  paginatedRows: Array<Array<Teacher>> = [];

  registrationForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null; // لعرض الصورة
  photoBase64: string = ''; // خاصية لتخزين الصورة بصيغة Base64
  

  constructor(private TeachersService: TeacherService, private fb: FormBuilder,private router: Router) { 
     // إعداد النموذج للتسجيل
     this.registrationForm = this.fb.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      phoneControl: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      photoBase64: [''],
      passwordControl: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")]],     
    });
  }
  

  async ngOnInit() {
    this.TeachersList = await this.TeachersService.getTeachers() || [];
    this.filteredTeachers = this.TeachersList;
    this.updatePagination();
  }

  // تحديث النتائج بناءً على البحث
  updateSearch() {
    if (this.searchText) {
      this.filteredTeachers = this.TeachersList.filter(teacher =>
        teacher.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        teacher.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredTeachers = this.TeachersList;
    }
    this.currentPage = 1; // إعادة تعيين الصفحة إلى الأولى عند البحث
    this.updatePagination();
  }

  //start pagination
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
  //end pagination
  showAddTeacherForm = false;

  // //////////////////////////////////////////

   // دالة لعرض وإخفاء الفورم
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
  
  // image proccess
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  // دالة لإضافة المدرس الجديد إلى القائمة
  addTeacher() {
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
  
      this.TeachersService.registerTeacher(formData).subscribe(response => {
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