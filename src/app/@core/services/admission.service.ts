import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService
  ) { }

  getAddmissionHistoryByPatientAdmissionId(addmissionId: number) {
    let _query = `select tap.AdmissionProcId, tap.AdmissionId, tap.ProcId, tap.ProcDate, tap.CreatedBy, tl.ListType as 'ProcType', tl.ListItem as 'ProcName', tap.Active, tap.Remarks from tblAdmissionProc tap inner join tblListItems tl on tap.ProcId = tl.ListItemId where tap.AdmissionId = ${addmissionId} order by CreatedAt desc`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getNoteHistoryByPatientAdmissionIdNoteType(addmissionId: number, _noteType: string) {
    let _query = `
    select distinct convert(nvarchar(11), ProcDate,113) as ProcName
    ,COUNT(*) noofentries ,max(ProcDate)  from tblAdmissionProc
    where AdmissionId=${addmissionId} \n and  active=1
    --and REMARKS IN ('${_noteType.toUpperCase()}') \n
    group by convert(nvarchar(11), ProcDate,113)
    \n order by 3 desc`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getLastAppointmentId() {
    let _query = `
     select top 1 AppointmentId from tblAppointment order by AppointmentId desc`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getAppointmentDetailsByAppointmentIdPatientId(appointmentId: number, patientId: number) {
    let _query = `select * from tblAppointment where EntityId = ${patientId} and AppointmentId = ${appointmentId} and Active = 1`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getAddmissionDetailsByAdmissionIdPatientId(admissionId: number, patientId: number) {
    let _query = `select * from tblAdmission where PatientId = ${patientId} and AdmissionId = ${admissionId} and Active = 1`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPreviousAdmissionListByPatientId(patientId: number) {
    // let _query = `select * from tblAdmission where PatientId = 2136 and Active = 1 order by TAdmissionDate desc`;
    let _query = `select * from tblAdmission where PatientId = ${patientId} and Active = 1 order by AdmissionId desc`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getNotesList(_type: string, _admissionId: number, _fromDate: string, _toDate: string) {
    let _query = `
    SELECT AdmissionProcId, AdmissionId ,ProcId, ProcDate, Remarks, Active, CreatedBy,
    dbo.getAllDataParagraph(AdmissionProcId) as data FROM TBLADMISSIONPROC P
    WHERE P.Active =1 AND REMARKS IN ('${_type}') AND ADMISSIONID=${_admissionId} and procdate between '${_fromDate}'
    and DATEADD(second, -1, (DATEADD(day, 1, '${_toDate}')))ORDER BY procdate DESC
    `;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
