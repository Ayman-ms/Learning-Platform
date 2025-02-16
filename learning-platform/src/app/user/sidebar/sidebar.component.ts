import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class UserSidebarComponent {
  userToEdit: Student = {
    id: '', firstName: '', lastName: '', password: '', email: '', phone: '', level: '',
    PhotoBase64: ''
  };

  constructor(public accountService: SessionService) {
    accountService.user.subscribe((u) => {
      this.userToEdit = u;
    });
  }
}
