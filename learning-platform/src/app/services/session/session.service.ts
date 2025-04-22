import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from 'src/app/models/student';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private userSubject: BehaviorSubject<Student>;
  public user: Observable<Student>;
  private currentUserSubject = new BehaviorSubject<Student | null>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService) {
    this.userSubject = new BehaviorSubject<Student>(JSON.parse(localStorage.getItem('user') as any));
    this.user = this.userSubject.asObservable();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get userValue(): Student {
    return this.userSubject.value;
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  setCurrentUser(user: Student) {
    if (!user.profileImage) {
      user.profileImage = '/assets/default-profile.png'; // صورة افتراضية إذا لم تكن الصورة موجودة
    }
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(user: Student) {
    this.userSubject.next(user);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') as any)
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    const u: Student = {
      firstName: 'anonymos',
      lastName: 'anonymos',
      id: '',
      password: '',
      email: '',
      phone: '',
      profileImage: '',
      createdAt: ''
    };
    this.userSubject.next(u);
    this.router.navigate(['/']);
  }

   // new user
   register(user: Student) {
    return this.http.post<Student>('https://localhost:44355/User', user).toPromise();
  }

  // all user
  getAll() {
    return this.userService.getUsers()
  }

  // get specific user
  getById(id: Student) {
    return this.userService.getUser(id);
  }
}
