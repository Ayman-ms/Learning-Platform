import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
  showSidebar: boolean = false;

  openNav() {
    this.showSidebar = true;
  }

  closeNav() {
    this.showSidebar = false;
  }

  toggleNav() {
    this.showSidebar = !this.showSidebar;
  }

}