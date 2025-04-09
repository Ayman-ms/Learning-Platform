import { AbstractControl, ValidationErrors } from '@angular/forms';
import { APP_CONSTANTS } from '../constants/app.constants';

export class FormValidators {
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    const pattern = new RegExp(
      `^[0-9]{${APP_CONSTANTS.VALIDATION.PHONE.MIN_LENGTH},${APP_CONSTANTS.VALIDATION.PHONE.MAX_LENGTH}}$`
    );
    return pattern.test(control.value) ? null : { invalidPhone: true };
  }

  static password(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true };

    const hasMinLength = control.value.length >= APP_CONSTANTS.VALIDATION.PASSWORD.MIN_LENGTH;
    const hasLetter = /[A-Za-z]/.test(control.value);
    const hasNumber = /\d/.test(control.value);

    const errors: ValidationErrors = {};

    if (!hasMinLength) errors['minLength'] = true;
    if (!hasLetter) errors['requiresLetter'] = true;
    if (!hasNumber) errors['requiresNumber'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  static email(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return pattern.test(control.value) ? null : { invalidEmail: true };
  }
}