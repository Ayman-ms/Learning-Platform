import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-controll',
  templateUrl: './admin-controll.component.html',
  styleUrls: ['./admin-controll.component.css']
})
export class AdminControllComponent {
  constructor(public sidebarService: SidebarService) {}
}
