import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private sessionService: SessionService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      const credentials = this.loginForm.value;
      const response = await this.authService.login(credentials).toPromise();
      
      if (response) {
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'You have successfully logged in!'
        });
        this.sessionService.setCurrentUser(response); // Store the logged-in user
        this.router.navigate(['/']);
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid email or password'
      });
    } finally {
      this.isLoading = false;
    }
  }
}