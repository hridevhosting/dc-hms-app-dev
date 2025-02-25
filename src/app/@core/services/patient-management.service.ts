import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';
import { Patient } from 'src/app/shared/modals/Patient';

@Injectable({
  providedIn: 'root'
})
export class PatientManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getPatientDetailsByPatientId(patientId: number) {
    let _query = `select * from tblEntity where EntityId = ${patientId} and Active = 1;`
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPatientDetailsByPatientPatientName_IPD_Dashboard(patientName: string) {
    let _query = `select EntityId, EntityName, RegNo, Active from tblEntity where EntityName like '${patientName.toLowerCase()}%';`
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPatient_IPD_OPD_PATH_History_Detail(_patient: Patient) {
    let _query = `

    --IPD Patient Admission History
    select 'IPD' as HospitalSectionName;
    select * from tblAdmission where PatientId = ${_patient.EntityId} and Active = 1 order by EntryDate desc

    --OPD Patient Appointment History
    select 'OPD' as HospitalSectionName;
    select * from tblAppointment where EntityId = ${_patient.EntityId} and Active = 1 and Description not like 'admissionno%' order by StartDatetime desc

    --Path Patient History
    select 'PATH' as HospitalSectionName;
    select * from tblAppointment where EntityId = ${_patient.EntityId} and Active = 1 and Description like 'admissionno%' order by StartDatetime desc

    `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
