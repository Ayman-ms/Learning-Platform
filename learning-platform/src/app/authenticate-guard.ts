import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from './services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router,
              private sessionService: SessionService
  ) {}

  canActivate(): boolean {
    const user = this.sessionService.getUser();

    if (user && user.roll === 'admin') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
