import { AfterViewInit, Component } from '@angular/core';
import { Dropdown } from 'bootstrap';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  ngAfterViewInit() {
    
  }
  toggel(){
    if(document.getElementById("")?.classList.contains("open")){
      document.getElementById("")?.classList.remove("open");
    }
    else{
      document.getElementById("")?.classList.add("open");
    }    
  }
}
