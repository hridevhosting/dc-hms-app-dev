import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttributeSetService {

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService
  ) { }

  getAttributeSet() {
    let _dep = null;
    if (environment.hospitalSection) {
      _dep = environment.hospitalSection.toUpperCase()
    } else {
      if (history.state.hospitalSection) {
        _dep = history.state.hospitalSection.toUpperCase()
      } else {
        _dep = '';
      }
    }
    _dep = _dep.toLowerCase() === 'ipd' ? 'OT' : _dep;
    let _query = `EXEC usp_AttributeSet_GetForSingle '${_dep}'`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveAttributeSet(appointmentId: number, setName: string) {
    let _dep = null;
    if (environment.hospitalSection) {
      _dep = environment.hospitalSection.toUpperCase()
    } else {
      if (history.state.hospitalSection) {
        _dep = history.state.hospitalSection.toUpperCase()
      } else {
        _dep = '';
      }
    }
    _dep = _dep.toLowerCase() === 'ipd' ? 'OT' : _dep;
    let _query = `execute nik_Appointment_Attribute_CopyUnUsed_V1 ${appointmentId}, N'${_dep}', N'${setName || ''}', ${this._commonService.getCurrentSessionUserId() || 0},'${setName || ''}' `;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
