import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { HttpClient } from '@angular/common/http';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getEmployeeDetailsByUserId(userId: number) {
    let _query = `select * from emp_master where USERID = ${userId} and Active = 1;`
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


}
