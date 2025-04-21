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
export class PasswordInputComponent implements ControlValueAccessor {
  // Inputs for customization
  @Input() label: string = 'Password';
  @Input() placeholder: string = 'Enter password';
  @Input() showGenerate: boolean = true;

  // Component state
  isPasswordVisible: boolean = false;
  password: string = '';

  // Callbacks for ControlValueAccessor
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // Toggles password visibility
  toggleVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Generates a random password
  generateRandomPassword(): void {
    const length = 12;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password and update state
    this.password = password.split('').sort(() => 0.5 - Math.random()).join('');
    this.isPasswordVisible = true;
  }

  // ControlValueAccessor methods
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
