import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { User } from 'src/app/models/users';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  userToEdit: User = {
    id: 0, firstName: '', lastName: '', password: '', email: '', phone: 0, level: '',
    avatar: ''
  };
  userIsAdmin = false;
  userLoggedIn = false;
  userList?: Array<User>;

  userForm = new FormGroup({
    passwordControl: new FormControl(null,
      [Validators.minLength(6),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$"),
      Validators.required]),
  })
  messageService: any;

  constructor(private route: ActivatedRoute, private router: Router, private httpClient: HttpClient,
    private userServic: UserService, public accountService: SessionService) {
    accountService.user.subscribe((u) => {
      this.userToEdit = u;
      if (u && u.level != 'user') {
        this.userIsAdmin = true;
      }
      else {
        this.userIsAdmin = false;
      }

      if (u && u.firstName != 'anonymos') {
        this.userLoggedIn = true;
      }
      else {
        this.userLoggedIn = false;
      }
    });
  }


  ngOnInit(): void {
    this.httpClient.get<Array<User>>('https://localhost:44355/User').subscribe((userListItems) => {
      this.route.queryParams
        .subscribe(params => {
          console.log(params['id']);
          for (let i = 0; i < userListItems.length; i++) {
            if (userListItems[i].id == params['id']) {
              this.userToEdit = userListItems[i];
              break;
            }
          }
        }
        )
    })
  }
  async updateClick() {

    let result = await this.userServic.updateUser(this.userToEdit);
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Success..', detail: 'User edited' });
      console.log('Done')
      this.router.navigateByUrl('editUser')
      this.router.navigateByUrl('')
    } else {
      alert("Edit not success")
    }
  }
  msgs = new Array<Message>();
  clickMessage() {
    alert('Error')
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'User edited' });
  }
}
