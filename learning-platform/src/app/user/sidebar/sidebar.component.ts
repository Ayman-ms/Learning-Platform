import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class UserSidebarComponent {
  userToEdit: User = {
    id: 0, firstName: '', lastName: '', password: '', email: '', phone: 0, level: '',
    avatar: ''
  };

  constructor(public accountService: SessionService) {
    accountService.user.subscribe((u) => {
      this.userToEdit = u;
    });
  }
}
