import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { SessionService } from 'src/app/services/session/session.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class UserSidebarComponent {
  userToEdit: Student = {
    id: '', firstName: '', lastName: '', password: '', email: '', phone: '',
    photoPath: '',
    createdAt: '',
    roll: ''
  };

  constructor(public accountService: SessionService,private sidebarService: SidebarService,
    private router: Router) {
    accountService.user.subscribe((u) => {
      this.userToEdit = u;
    });
  }

    isOpen$ = this.sidebarService.isSidebarOpen$;
    

  
    toggleNav() {
      this.sidebarService.toggleSidebar();
    }
  
    closeNav() {
      this.sidebarService.closeSidebar();
    }

    onLinkClick() {
      if (window.innerWidth <= 768) {
        this.sidebarService.closeSidebar();
      }
    }
}
