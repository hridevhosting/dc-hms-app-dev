import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class OpdManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getAppointmentPaitentListForOPD(fromDate: string, toDate: string) {
    let _query =
      `
     select A.AppointmentId , e.EntityId , e.EntityName as PatientName, A.CreatedAt , e.RegNo, a.Treatment,
     dbo.NikDefault_ApptAllReceipts(a.appointmentid,'OPD') as Receipt, a.Arrived, a.StartDateTime, a.EndDateTime, a.IsRecurring,
     a.Description, a.Location, a.BookedFor, a.Treatment, a.WhichOpd, a.RegNo as OPDNo, a.ReferredBy,
     e.Primaryfld2, isnull(LeftHosp,0)as LeftHosp, A.Active from tblappointment A,
     tblEntity E where A.IsRecurring = 0 and A.Active = 1 and E.Active = 1 and E.entityId = A.EntityId and
     WhichOPD is not null  and CAST(StartDatetime as date) between '${fromDate}' and '${toDate}'
     order by LeftHosp asc, appointmentid asc;
      `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  leftPatient(appointmentId: number, patientId: number, isLeft: number) {
    let _query = `update tblAppointment set LeftHosp = ${isLeft}, LeftAt = ${isLeft ? "'" + this._commonServices.trasformDateTimeByFormat() + "'" : null} where AppointmentId = ${appointmentId} and EntityId = ${patientId};`;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getBlankOpdCardData(_path?: string) {
    return this._httpClient.get('/assets/Templates/OPD/BlankOpdCard.html');
  }

}
