import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';
import { SpContant } from 'src/app/shared/modals/spConstant';

@Injectable({
  providedIn: 'root'
})
export class PathManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getPathTestListByCaseIdAndPatientId(_patientId: number, _caseId: number) {
    let _query =
      `
    select * from dbo.tblBillDetail
    where
    BillNo =
    ( select BillNo from tblBill
      where
            AppointmentId =
            ( select AppointmentId from dbo.tblAppointment
              where
              EntityId = ${_patientId} and
              Description = 'AdmissionNO=${_caseId}' and
              WhichOPD like 'pathology' and
              active = 1)
    and PatientId = ${_patientId} and
    B_WhichOpd like 'pathology') and active = 1;
    `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPathTestDetailByCaseIdAndPatientId(_patientId: number, _caseId: number) {
    let _query =
      `
      select * from tblBill
      where
      AppointmentId =
            ( select AppointmentId from dbo.tblAppointment
              where
              EntityId = ${_patientId} and
              Description = 'AdmissionNO=${_caseId}' and
              WhichOPD like 'pathology' and
              active = 1);
    `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getPathReportListByPatientIdPathId(_pathId: string, _patientId: number) {
    let _query =
      `
       select *  from tblPathReports where EntityId =${_patientId} and PathLabid = '${_pathId}' and Active = 1
  `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getPathReportListByPathIdPatientId(_date: string, _pathId: string, _patientId?: number, _patientName?: string) {
    let _query =
      `
        nik_Path_Report_GetList_v2
        '${this._commonServices.trasformDateTimeByFormat('dd MMM yyyy', _date)}',
        N'${_patientName || ''}',
        '${_pathId}',
        '${_patientId}',
        '0',
        1;
  `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPathReportItemListByPathReportDetail(_pathReportDetail: any, _patientDetail: any) {
    let _query =
      `
       EXEC ${SpContant.nik_Path_Report_Item_GetList} ${_pathReportDetail.PathReportId || 0},${_pathReportDetail.AppointmentId || 0},${_pathReportDetail.pkgid || 0},'${_pathReportDetail.PathLabId || ''}','${_patientDetail.PrimaryId1 || ''}','${_patientDetail.PrimaryFld2 || ''}'
      `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPathRegIdList(){
    let _query = `select Value from Conf_txt where confname like '%PATH_RegistrationId%' and Active = 1;`;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
