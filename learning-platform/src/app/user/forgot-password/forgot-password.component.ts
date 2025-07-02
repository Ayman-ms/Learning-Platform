import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Student } from 'src/app/models/student';
import { PasswordService } from 'src/app/services/password/password.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  userToLogin: Student = {} as Student;
  msgs: Message[] = [];
  email: string = '';

  constructor(
    private messageService: MessageService,
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
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reset link sent to your email' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send reset link' });
      }
    );
  }
}
