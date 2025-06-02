import { Component, HostListener } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isOpen$ = this.sidebarService.isSidebarOpen$;
  
  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}

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