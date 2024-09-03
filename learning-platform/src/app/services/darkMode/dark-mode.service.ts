import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkMode: boolean = false;

  constructor() {
    this.darkMode = !!localStorage.getItem('dark-mode');
    this.updateBodyClass();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('dark-mode', this.darkMode ? 'enabled' : '');
    this.updateBodyClass();
  }

  private updateBodyClass(): void {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}