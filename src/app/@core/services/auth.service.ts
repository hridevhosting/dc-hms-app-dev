import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService,
    private _router: Router
  ) { }

  login(loginDetails: any) {
    //debugger
    let _req = this._commonService.generateApiRequestParam(Constant.userFunNameList.validateUser, loginDetails);
    return this._httpClient.post(Constant.apiUrl + Constant.userController, _req);
  }

  logout(){
    sessionStorage.removeItem('user');
    this._router.navigate(['auth/login']);
  }

  validateUserSession() {
    // //debugger
    let _user: any = sessionStorage.getItem('user') || null;
    let _res: boolean = false;
    if (_user) {
      _user = JSON.parse(sessionStorage.getItem('user') || '')
      if (_user.UserId > 0) {
        _res = true;
        return _res
      } else {
        return _res
      }
    } else {
      return _res
    }
  }

}
