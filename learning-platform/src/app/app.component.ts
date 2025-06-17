import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  title = 'learning-platform';
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
}
