import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/darkMode/dark-mode.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor(private darkModeService: DarkModeService,
              private translate: TranslateService) 
  {
    translate.setDefaultLang('en');
  }
  

  ngOnInit(): void {
    this.updateIcon();
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
    this.updateIcon();
  }

  isDarkMode(): boolean {
    return this.darkModeService.isDarkMode();
  }

  updateIcon(): void {
    const iconElement = document.getElementById('modeIcon');
    if (iconElement) {
      if (this.isDarkMode()) {
        iconElement.classList.add('bi-moon');
        iconElement.classList.remove('bi-brightness-high');
      } else {
        iconElement.classList.add('bi-brightness-high');
        iconElement.classList.remove('bi-moon');
      }
    }
  }

  switchLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const language = target?.value;
  
    if (language) {
      this.translate.use(language);
    }
  }
  

}

