import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { User } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PasswordService } from 'src/app/services/password/password.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  userToLogin: User = {} as User;
  msgs: Message[] = [];
  email: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private authService: AuthService,
  private passwordService: PasswordService
  ) { }

  ngOnInit(): void {
    
  }


  //FORGET PASSWORD FUNCTION
  sendPasswordForget() {
    if (!this.email) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter an email' });
      return;
    }

    this.passwordService.sendPasswordForget(this.email).subscribe(
      (success) => {
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reset link sent to your email' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email not found' });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send reset link' });
      }
    );
  }
}
