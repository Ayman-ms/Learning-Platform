import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  newUserForm: FormGroup;
  public userToAdd: User = { id: 0, firstName: '', lastName: '', password: '', email: '', phone: 0 };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    this.newUserForm = this.fb.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      emailControl: ['', [Validators.required, Validators.email]],
      passwordControl: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$")]],
      confirmPasswordControl: ['', Validators.required],
      phoneControl: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('passwordControl')?.value;
    const confirmPassword = form.get('confirmPasswordControl')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async newUser() {
    let result = await this.userService.createUser(this.userToAdd);
    if (result) {
      console.log("add success");
      this.router.navigateByUrl('');
    } else {
      alert("add not success");
    }
  }

  onSubmit() {
    console.log(this.newUserForm);
  }
}
