import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users/user.service';
import { Student } from 'src/app/models/student';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { SessionService } from 'src/app/services/session/session.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userToEdit: Student = {
    id: '', firstName: '', password: '', email: '', phone: '',
    lastName: '',
    PhotoBase64: ''
  };
  userIsAdmin = false;
  userLoggedIn = false;
  userForm = new FormGroup({
    firstName: new FormControl(this.userToEdit.firstName, Validators.required),
    lastName: new FormControl(this.userToEdit.lastName, Validators.required),
    password: new FormControl(this.userToEdit.password, [
      Validators.minLength(6),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$"),
      Validators.required
    ]),
    email: new FormControl(this.userToEdit.email, [Validators.required, Validators.email]),
    // level: new FormControl(this.userToEdit.level)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService,
    public accountService: SessionService,
    private messageService: MessageService
  ) {
    accountService.user.subscribe((u) => {
      this.userToEdit = u;
      // this.userIsAdmin = u && u.level !== 'user';
      this.userLoggedIn = u && u.firstName !== 'anonymos';
    });
  }

  userList?: Array<Student>;

  ngOnInit(): void {
    this.httpClient.get<Array<Student>>('https://localhost:44355/User').subscribe((userListItems) => {
      this.route.queryParams.subscribe(params => {
        console.log(params['id']);
        for (let user of userListItems) {
          if (user.id == params['id']) {
            this.userToEdit = user;
            this.userForm.patchValue(user);
            break;
          }
        }
      });
    });
  }

  async updateClick() {
    let result = await this.userService.updateUser(this.userToEdit);
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Success..', detail: 'User edited' });
      this.router.navigateByUrl('editUser');
      this.router.navigateByUrl('');
    } else {
      console.log('Edit not successful');
      alert("Edit not successful");
    }
  }

  msgs = new Array<Message>();

  clickMessage() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'User edited' });
  }
}
