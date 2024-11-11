import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { SessionService } from "./services/session/session.service";

@Injectable()
export class AuthenticateGuard implements CanActivate {
  constructor(private sessionService: SessionService) {

  }
  canActivate() {
    const user = this.sessionService.getUser();
    if (user && user.userName != 'anonymos') {
      return true;
    }
    else {
      return false;
    }
  }

}