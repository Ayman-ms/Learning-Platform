import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  userLoggedIn = false;
  currentUser: Student | null = null;

  constructor(public sessionService: SessionService, private router: Router) {
    this.sessionService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.userLoggedIn = !!user;
    });
  }

  ngAfterViewInit() {}

  toggel() {
    if (document.getElementById("")?.classList.contains("open")) {
      document.getElementById("")?.classList.remove("open");
    } else {
      document.getElementById("")?.classList.add("open");
    }
  }

  logout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }
}
