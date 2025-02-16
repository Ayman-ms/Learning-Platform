import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';import { PasswordService } from 'src/app/services/password/password.service';
 @Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userToLogin: Student = {} as Student;
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
    // Initialize your component logic here if needed
  }

  async loginClick() {
    const userListItems = await this.userService.getUsers();
    if (userListItems) {
      const userToLogin = userListItems.find(async user =>
        user.email === this.userToLogin.email &&
        user.password === await this.sha256(this.userToLogin.password)
      );

      if (userToLogin) {
        this.sessionService.login(userToLogin);
        localStorage.setItem('user', JSON.stringify(userToLogin));
        this.router.navigateByUrl('');
        console.log('Done')
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Login successful' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
      }
    }
  }

  async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

}