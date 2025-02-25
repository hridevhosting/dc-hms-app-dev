import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService
  ) { }

  getUserListWithOnlyLoginName() {
    let _query = 'select LoginName from tblUser where Active = 1;'
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getUserListWithOnlyUserIdUserName() {
    let _query = 'select UserId, UserName from tblUser where Active = 1;'
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    console.log(_req);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getUserDetailsByUserId(userId?: number) {
    //debugger
    let _userId: number = 0;
    _userId = userId || userId != undefined ? userId : 0
    if (!_userId) {
      _userId = this._commonService.getCurrentSessionUserId();
    }
    let _query = `select * from tblUser where UserId = ${_userId} and Active = 1;`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getUserDetailByContactNo(_contactNo: string) {
    let _query = `select tu.UserId, tu.UserName, tu.Role, tu.Active, em.MobileNo from EMP_Master em left join tblUser tu on em.USERID = tu.UserId where em.MobileNo = '${_contactNo}'and em.Active = 1 and tu.Active = 1;`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
