import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent {

  @Input() label: string = 'Password';
  @Input() placeholder: string = 'Enter password';
  @Input() showGenerate: boolean = true; // للتحكم في عرض زر التوليد
  isPasswordVisible: boolean = false;
  password: string = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  toggleVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  generateRandomPassword(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!';
    let generatedPassword = '';
    for (let i = 0; i < 10; i++) {
      generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.password = generatedPassword;
    this.onChange(this.password);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.password = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
