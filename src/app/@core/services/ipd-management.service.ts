import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class IpdManagementService {

  constructor(
    private _commonServices: CommonService,
    private _httpClient: HttpClient
  ) { }

  getAddmittedPaitentListForIPD_Old(fromDate?: string, toDate?: string) {
    let _query =
      `
    select
ta.AdmissionId,
ta.AdmissionDate,
te.EntityId,
te.EntityName,
ta.PatientId,
ta.EntryDate,
ta.ProcAdviced,
ta.ProcNotes,
ta.AdmissionRequired,
ta.ConsentRequired,
ta.TentativeCharges,
ta.TAdmissionDate,
ta.TProcedureDate,
ta.ReferedBy,
ta.Location,
ta.Active,
ta.AdmissionDate,
ta.DischargeDate,
ta.Status,
ta.RegNo,
ta.AdmissionType,
ta.MedicoLegal,
ta.DischargeReason,
ta.AdmRecNo,
ta.AdmRecDate,
ta.RName,
ta.RAddress,
ta.RCity,
ta.RPhone,
ta.RPin,
ta.RMobile,
ta.RType,
ta.Consultant,
ta.BillClass,
ta.Payer,
ta.BillCat,
ta.PreparedBy,
ta.PrintedBy,
ta.Witness,
ta.MLCNumber,
ta.MediumofAdm,
ta.department,
ta.curr_AdmissionBedid,
ta.MRDNO,
ta.ADDITIONALDETAIL

from tblAdmission ta, tblEntity te where ta.PatientId = te.EntityId and DischargeDate is null and DischargeReason is null ${fromDate && toDate ? `and CAST(EntryDate as date) between '${fromDate}' and '${toDate}'` : ''} order by EntryDate desc
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getAddmittedPaitentListForIPD(fromDate?: string, toDate?: string) {
    let _query =
      `
       select m.ProcAdviced,
       m.location,
       (select bedname as bed from  tblAdmissionBedHistory where AdmissionBedId=m.curr_AdmissionBedId ) Bed,
        (select BedType as bedtype from  tblAdmissionBedHistory where AdmissionBedId=m.curr_AdmissionBedId ) BedType,
       E.EntityId,
       E.EntityName,
       E.RegNo,
       m.regno as IPDNO,
       PrimaryFld1,
       PrimaryId1,
       A.AppointmentId,
       tadmissiondate as AdmissionDate,
       dbo.NIkDefault_ApptAllCharges(A.AppointmentId,'IPD') Charges,
       dbo.NikDefault_ApptAllReceipts(A.AppointmentId,'IPD') Receipts,
       LeftHosp,
       m.admissionid,
       e.PrimaryFld2 as sex,
       m.status,
       m.DischargeDate as DischargeDate,
       m.ADDITIONALDETAIL,
       m.MLCNumber,
       isnull(salutation,'') salutation,
        m.ReferedBy as ReferredBy,
       m.Consultant
       from tblappointment A,
       tblEntity E,
       tblAdmission M
       where A.Active = 1
       and E.Active = 1
       and M.Active =1
       and M.AdmissionId = A.AppointmentId
       and E.entityId = M.patientId
       and Status in (1,2)
        ${fromDate && toDate ? `and CAST(m.tadmissiondate as date) between '${fromDate}' and '${toDate}'` : ''}
       Order by m.tadmissiondate DESC;
       select UserName, UserId, Role, AssociationType, Active from tbluser where active=1 and role='Doctor';
       select distinct Location  from tblAdmissionBed where Active =1;
       select distinct Description   from tblAdmissionBedtype where Active =1 ;
       select distinct procadviced from tblAdmission where Status in (1,2) and Active=1
       select distinct ListItem from tblListItems where ListType like 'ReferralDoctor' and ListItem <> '' and Active = 1
       `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getDischargedPaitentListForIPD(fromDate?: string, toDate?: string) {
    let _query =
      `
      select
      ta.AdmissionId,
ta.AdmissionDate,
te.EntityId,
te.EntityName,
ta.PatientId,
ta.EntryDate,
ta.ProcAdviced,
ta.ProcNotes,
ta.AdmissionRequired,
ta.ConsentRequired,
ta.TentativeCharges,
ta.TAdmissionDate,
ta.TProcedureDate,
ta.ReferedBy,
ta.Location,
ta.Active,
ta.AdmissionDate,
ta.DischargeDate,
ta.Status,
ta.RegNo,
ta.AdmissionType,
ta.MedicoLegal,
ta.DischargeReason,
ta.AdmRecNo,
ta.AdmRecDate,
ta.RName,
ta.RAddress,
ta.RCity,
ta.RPhone,
ta.RPin,
ta.RMobile,
ta.RType,
ta.Consultant,
ta.BillClass,
ta.Payer,
ta.BillCat,
ta.PreparedBy,
ta.PrintedBy,
ta.Witness,
ta.MLCNumber,
ta.MediumofAdm,
ta.department,
ta.curr_AdmissionBedid,
ta.MRDNO,
ta.ADDITIONALDETAIL

from tblAdmission ta, tblEntity te where ta.PatientId = te.EntityId and DischargeDate is not null and DischargeReason is not null ${fromDate && toDate ? `and CAST(EntryDate as date) between '${fromDate}' and '${toDate}'` : ''} order by EntryDate desc
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPaitentListForIPD(fromDate?: string, toDate?: string, patientId?: number) {
    let _query =
      `
       select m.ProcAdviced,
       m.location,
       (select bedname as bed from  tblAdmissionBedHistory where AdmissionBedId=m.curr_AdmissionBedId ) Bed,
        (select BedType as bedtype from  tblAdmissionBedHistory where AdmissionBedId=m.curr_AdmissionBedId ) BedType,
       E.EntityId,
       E.EntityName,
       E.RegNo,
       m.regno as IPDNO,
       PrimaryFld1,
       PrimaryId1,
       A.AppointmentId,
       tadmissiondate as AdmissionDate,
       dbo.NIkDefault_ApptAllCharges(A.AppointmentId,'IPD') Charges,
       dbo.NikDefault_ApptAllReceipts(A.AppointmentId,'IPD') Receipts,
       LeftHosp,
       m.admissionid,
       e.PrimaryFld2 as sex,
       m.status,
       m.DischargeDate as DischargeDate,
       m.ADDITIONALDETAIL,
       m.MLCNumber,
       isnull(salutation,'') salutation,
        m.ReferedBy as ReferredBy,
       m.Consultant
       from tblappointment A,
       tblEntity E,
       tblAdmission M
       where A.Active = 1
       and E.Active = 1
       and M.Active =1
       and M.AdmissionId = A.AppointmentId
       ${!patientId ? 'and E.entityId = M.patientId' : ''}
        ${patientId ? 'and E.entityId = ' + patientId : ''}
        ${patientId ? 'and M.patientId = ' + patientId : ''}
        ${!patientId ? `and Status in (1,2 ${fromDate && toDate ? fromDate == toDate ? '' : `,3` : ''})` : ''}
         ${patientId ? `and Status in (1,2,3)` : ''}
       ${!patientId ? `${fromDate && toDate ? fromDate == toDate ? '' : `and CAST(m.tadmissiondate as date) between '${fromDate}' and '${toDate}'` : ''}` : ''}
       ${patientId ? `and CAST(m.tadmissiondate as date) between '${fromDate}' and '${toDate}'` : ''}
       Order by m.tadmissiondate DESC;
       select UserName, UserId, Role, AssociationType, Active from tbluser where active=1 and role='Doctor';
       select distinct Location  from tblAdmissionBed where Active =1;
       select distinct Description   from tblAdmissionBedtype where Active =1 ;
       select distinct procadviced from tblAdmission where Status in (1,2) and Active=1
       select distinct ListItem from tblListItems where ListType like 'ReferralDoctor' and ListItem <> '' and Active = 1
       `;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getAppointmentPaitentListForOPD_old(fromDate: string, toDate: string) {
    let _query =
      `
      select ta.* , te.EntityName as 'PatientName', tb.TotalAmt, tb.IPCaseNo, tb.AmountToPatient, tb.AmountToPayer, tb.BillNo, tbr.BillReceiptId, tbr.Receipts, tbr.ReceiptNo
      from tblAppointment ta
      inner join tblEntity te
      on ta.EntityId = te.EntityId
      and te.Active = 1
      inner join tblbill tb
      on tb.PatientId = te.EntityId
      and tb.AppointmentId = ta.AppointmentId
      and tb.B_WhichOpd like ta.WhichOPD
      and tb.Active = 1
      inner join tblBillReceipt tbr
      on tbr.BillNo = tb.BillNo
      and tbr.R_WhichOpd like ta.WhichOPD
      and tbr.Active = 1
      where CAST(ta.CreatedAt as date) between '${fromDate}' and '${toDate}'
      and ta.Arrived = 1
      and ta.Active = 1
      and ta.EntityId is not null
      and ta.EntityId > 0
      and ta.WhichOPD like 'opd'
      order by ta.CreatedAt desc
      `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getAppointmentPaitentListForOPD(fromDate: string, toDate: string) {
    let _query =
      `
     select A.AppointmentId , e.EntityId , e.EntityName as PatientName, A.CreatedAt , e.RegNo, a.Treatment,
     dbo.NikDefault_ApptAllReceipts(a.appointmentid,'OPD') as receipt, a.Arrived,
     e.primaryfld2, isnull(LeftHosp,0)as LeftHosp from tblappointment A,
     tblEntity E where A.Isrecurring = 0 and A.Active = 1 and E.Active = 1 and E.entityId = A.EntityId and
     WhichOPD is not null  and CAST(StartDatetime as date) between '${fromDate}' and '${toDate}'
     order by LeftHosp asc, appointmentid desc;
      `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPatientDetailsListByPatientId(patientIdArray: string) {
    let _query =
      `
      select * from tblEntity where EntityId in (${patientIdArray}) and Active = 1;
      `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
