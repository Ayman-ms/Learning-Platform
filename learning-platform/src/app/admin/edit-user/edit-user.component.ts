import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { User } from 'src/app/models/users';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userToEdit: User = {
    id: 0, firstName: '', password: '', email: '', phone: 0,
    lastName: '',
    level: '',
    avatar: ''
  };
  // input status
  isFirstNameDisabled = true;
  isLastNameDisabled = true;
  isPasswordDisabled = true;
  isEmailDisabled = true;
  isPhoneDisabled = true;
  // user
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
    level: new FormControl(this.userToEdit.level)
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
      this.userIsAdmin = u && u.level !== 'user';
      this.userLoggedIn = u && u.firstName !== 'anonymos';
    });
  }

  userList?: Array<User>;

  ngOnInit(): void {
    this.httpClient.get<Array<User>>('https://localhost:44355/User').subscribe((userListItems) => {
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
      this.router.navigateByUrl('admin');
      this.router.navigateByUrl('');
    } else {
      console.log('Edit not successful');
      alert("Edit not successful");
    }
  }
  // toggle input status
  toggleFirstNameEdit() {
    this.isFirstNameDisabled = !this.isFirstNameDisabled;
  }
  toggleLastNameEdit() {
    this.isLastNameDisabled = !this.isLastNameDisabled;
  }
  togglePasswordEdit() {
    this.isPasswordDisabled = !this.isPasswordDisabled;
  }
  toggleEmailEdit() {
    this.isEmailDisabled = !this.isEmailDisabled;
  }
  togglePhoneEdit() {
    this.isPhoneDisabled = !this.isPhoneDisabled;
  }
  msgs = new Array<Message>();

  clickMessage() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'User edited' });
  }
}
