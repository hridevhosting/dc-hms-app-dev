import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private _httpClient: HttpClient,
    private _commonService: CommonService
  ) { }


  getAppointmentDetailsByAppointmentId(appointmentId: number) {
    let _query = `select * from tblAppointment where AppointmentId = ${appointmentId} and Active = 1`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getAppointmentDetailsByAppointmentIdPatientId(appointmentId: number, patientId: number) {
    let _query = `select * from tblAppointment where EntityId = ${patientId} and AppointmentId = ${appointmentId} and Active = 1`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPreviousAppointmentListByPatientId(patientId: number) {
    let _query = `select * from tblAppointment where EntityId = ${patientId} and whichopd like 'opd' and Active = 1 order by AppointmentId desc`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getAppointmentReasonConsultantDoctorReferralDoctorDepartmentList() {
    let _query = `
      select listtype,listItem from tbllistitems where listtype ='Appointment Reason' and Active=1;
      select 'Consultant Doctor',UserName  from tblUser where [role]='Doctor';
      select listtype,listItem from tbllistitems where listtype ='ReferralDoctor' and Active=1;
      select listtype,listItem from tbllistitems where listtype ='DEPARTMENT' and Active=1;
      select  bookedfor, department, referredby, (select value from conf_txt where ConfName='Appointment_DefaultDoctor') as Appointment_DefaultDoctor
      from tblappointment where AppointmentId=(select MAX(appointmentid) from tblappointment where isrecurring=0 and entityid=10 and active=1);
    `
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
