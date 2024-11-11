import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/models/users';
import { AvatarService } from 'src/app/services/avatar/avatar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

//   newUserForm: FormGroup;
//   public userToAdd: User = {
//     id: 0, firstName: '', lastName: '', password: '', email: '', phone: 0, level: 'user',
//     avatar: ''
//   };

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private userService: UserService,
//     private router: Router
//   ) {
//     this.newUserForm = this.fb.group({
//       firstNameControl: ['', Validators.required],
//       lastNameControl: ['', Validators.required],
//       emailControl: ['', [Validators.required, Validators.email]],
//       passwordControl: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$")]],
//       confirmPasswordControl: ['', Validators.required],
//       phoneControl: ['', Validators.required]
//     }, { validator: this.passwordMatchValidator });
//   }
//   uploadedImage: string | undefined ;
//   ngOnInit(): void { }

//   passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
//     const password = form.get('passwordControl')?.value;
//     const confirmPassword = form.get('confirmPasswordControl')?.value;
//     if (password !== confirmPassword) {
//       return { passwordMismatch: true };
//     }
//     return null;
//   }

//   // async newUser() {
//   //   let result = await this.userService.createUser(this.userToAdd);
//   //   if (result) {
//   //     console.log("add success");
//   //     this.router.navigateByUrl('');
//   //   } else {
//   //     alert("add not success");
//   //   }
//   // }

//   async newUser() {
//     const formData = new FormData();

//     // تأكد من أن القيم تتطابق مع الحقول المتوقعة من API
//     formData.append('firstName', this.newUserForm.get('firstNameControl')?.value);
//     formData.append('lastName', this.newUserForm.get('lastNameControl')?.value);
//     formData.append('email', this.newUserForm.get('emailControl')?.value);
//     formData.append('password', this.newUserForm.get('passwordControl')?.value);
//     formData.append('phone', this.newUserForm.get('phoneControl')?.value);

//     if (this.uploadedImage) {
//       formData.append('avatarFile', this.uploadedImage);
//     }

//     const result = await this.userService.createUser(formData);
//     if (result) {
//       console.log("add success");
//       this.router.navigateByUrl('');
//     } else {
//       alert("add not success");
//     }
//   }

//   onSubmit() {
//     // console.log(this.newUserForm);
//     if (this.newUserForm.valid) {
//       this.newUser(); // تنفيذ الدالة التي تقوم بإرسال البيانات إلى الـ API
//     } else {
//       alert("Form is invalid");
//     }
//   }
//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.userToAdd.avatar = file; // بدلاً من معالجة الملف إلى Base64، قم بحفظه كما هو
//     }
//   }
// }


  registrationForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    // the form for reggistration 
    this.registrationForm = this.fb.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      phoneControl: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      passwordControl: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")]],
      confirmPasswordControl: ['', Validators.required],
      avatar: [null]
    });
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
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Model sending the form
  onSubmit() {
    if (this.registrationForm.valid) {
      // proccess the form
      const formData = new FormData();
      formData.append('firstNameControl', this.registrationForm.get('firstNameControl')?.value);
      formData.append('lastNameControl', this.registrationForm.get('lastNameControl')?.value);
      formData.append('phoneControl', this.registrationForm.get('phone')?.value);
      formData.append('emailControl', this.registrationForm.get('email')?.value);
      formData.append('passwordControl', this.registrationForm.get('password')?.value);
      
      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile, this.selectedFile.name);
      }

      // consol
      console.log('User Data:', formData);

      // هنا يمكن استدعاء خدمة لإرسال البيانات إلى الـ API
      alert("User registered successfully!");
      this.registrationForm.reset();
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
}



