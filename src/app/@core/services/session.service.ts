import { Injectable } from '@angular/core';
import { SessionDetails } from 'src/app/shared/modals/sessionDetail';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  setSession(sessionDetails: SessionDetails) {
    sessionStorage.setItem('user', JSON.stringify(sessionDetails));
  }

}
