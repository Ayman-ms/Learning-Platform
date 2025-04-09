import { Injectable } from '@angular/core';
import { MessageService as PrimeMessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private primeMessageService: PrimeMessageService) {}

  showSuccess(message: string, title: string = 'Success'): void {
    this.primeMessageService.add({
      severity: 'success',
      summary: title,
      detail: message
    });
  }

  showError(message: string, title: string = 'Error'): void {
    this.primeMessageService.add({
      severity: 'error',
      summary: title,
      detail: message
    });
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.primeMessageService.add({
      severity: 'warn',
      summary: title,
      detail: message
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.primeMessageService.add({
      severity: 'info',
      summary: title,
      detail: message
    });
  }

  clear(): void {
    this.primeMessageService.clear();
  }
}