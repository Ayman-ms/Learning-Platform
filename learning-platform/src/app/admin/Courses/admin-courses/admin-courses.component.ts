import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/services/courses/courses.service';

@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.css']
})
export class AdminCoursesComponent {
  courseForm: FormGroup;
  selectedImage: File | null = null;
  previewImage: string | null = null;

  constructor(private fb: FormBuilder, private coursesService: CoursesService) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      teacherID: ['', Validators.required],
      image: [null]
    });
  }

  // معالجة اختيار الصورة
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // عرض الصورة في واجهة المستخدم قبل الرفع
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // رفع النموذج إلى الخادم
  async onSubmit() {
    if (this.courseForm.invalid || !this.selectedImage) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.courseForm.value.name);
    formData.append('description', this.courseForm.value.description);
    formData.append('teacherID', this.courseForm.value.teacherID);
    formData.append('image', this.selectedImage);

    try {
      await this.coursesService.addCourse(formData);
      alert('Course added successfully!');
      this.courseForm.reset();
      this.previewImage = null;
    } catch (error) {
      console.error(error);
      alert('Error while adding the course.');
    }
  }
}
