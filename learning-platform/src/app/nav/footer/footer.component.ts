import { Component } from '@angular/core';
import { DarkModeService } from 'src/app/services/darkMode/dark-mode.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private darkModeService: DarkModeService) {}

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  isDarkMode(): boolean {
    document.getElementById('dark')
    return this.darkModeService.isDarkMode();
  }
}