import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  //debugger
  if(inject(AuthService).validateUserSession()){
    return true;
  } else {
    inject(Router).navigate(['auth/login'])
    return false;
  }
};
