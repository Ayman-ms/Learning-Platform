import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div *ngIf="message" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ message }}
    </div>
  `,
  styles: [`
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string = '';
}