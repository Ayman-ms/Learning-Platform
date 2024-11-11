import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/users';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') as any));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(user: User) {
    this.userSubject.next(user);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') as any)
  }

  logout() {
    localStorage.removeItem('user');
    const u: User = {
      firstName: 'anonymos',
      lastName: 'anonymos',
      id: 0,
      password: '',
      email: '',
      phone: 0,
      level: '',
      avatar: ''
    };
    this.userSubject.next(u);
    this.router.navigate(['/']);
  }

   // new user
   register(user: User) {
    return this.http.post<User>('https://localhost:44355/User', user).toPromise();
  }

  // all user
  getAll() {
    return this.userService.getUsers()
  }

  // get specific user
  getById(id: User) {
    return this.userService.getUser(id);
  }
}
