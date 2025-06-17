import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly storageKey = 'darkMode';

  constructor() {
    const savedMode = localStorage.getItem(this.storageKey);
    if (savedMode === 'true') {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  toggleDarkMode(): void {
    const isDark = this.isDarkMode();
    if (isDark) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  private enableDarkMode(): void {
    document.body.classList.add('dark-mode');
    localStorage.setItem(this.storageKey, 'true');
  }

  private disableDarkMode(): void {
    document.body.classList.remove('dark-mode');
    localStorage.setItem(this.storageKey, 'false');
  }
}
