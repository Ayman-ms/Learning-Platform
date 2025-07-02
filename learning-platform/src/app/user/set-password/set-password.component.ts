import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PasswordService } from 'src/app/services/password/password.service';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

  token: string = '';
  password: string = '';
  passwordConf: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordService: PasswordService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  resetPassword() {
    if (!this.password || !this.passwordConf) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all fields' });
      return;
    }

    this.passwordService.resetPassword(this.token, this.password, this.passwordConf).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully' });
        this.router.navigate(['/login']);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reset password' });
      }
    );
  }
}
