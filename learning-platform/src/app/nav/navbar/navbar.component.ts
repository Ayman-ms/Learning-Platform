import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { Student } from 'src/app/models/student';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  userLoggedIn = false;
  currentUser: Student | null = null;
  isSidebarOpen$: Observable<boolean>;

  constructor(
    public sessionService: SessionService,
    private router: Router,
    public sidebarService: SidebarService
  ) {
    this.sessionService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.userLoggedIn = !!user;
    });

    this.isSidebarOpen$ = this.sidebarService.isSidebarOpen$;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  ngAfterViewInit()  {}

  logout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }
}
