import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from 'src/app/shared/modals/constant';
import { CommonService } from './common.service';
import { Response } from 'src/app/shared/modals/response';
import { List } from 'src/app/shared/modals/list';

@Injectable({
  providedIn: 'root'
})
export class ReportCollectionManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getCashSummaryReports(_fromDate: string, _toDate: string, isIPD: boolean, isOPD: boolean, isPath: boolean) {
    let _query = `
      select
      tb.BillNo, tb.IPCaseNo, tb.PatientId, tb.AppointmentId, tb.PayerName, tb.TPA,
      tb.BillDate, tb.AdmissionDate, tb.DischargeDate, tb.PanNo,tb.BedNo, tb.TotalAmt, tb.AmountToPatient,
      ReceiptAmount = (select SUM(Receipts) from tblBillReceipt where BillNo = tb.billno),
      tb.DiscountAmt, tb.AmountToPayer, tb.B_Department, tb.B_WhichOpd, tb.Active
      from tblBill as tb
      where
      AppointmentId in
      (select
      ${isIPD ? 'AdmissionId' : ''}
      ${isOPD ? 'AppointmentId' : ''}
      from
      ${isIPD ? 'tblAdmission' : ''}
      ${isOPD ? 'tblAppointment' : ''}
      where
      ${isIPD ? ' CAST(TAdmissionDate as Date)' : ''}
      ${isOPD ? ' CAST(StartDatetime as Date)' : ''}
      between '${_fromDate}' and '${_toDate}') and
      B_WhichOpd like
      ${isIPD ? "'ipd'" : ''}
      ${isOPD ? "'opd'" : ''}
      'ipd';
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getIpdAdmittedPatientList(_formDate: string, _toDate: string) {
    let _query = `
    select * from tblAdmission where CAST(TAdmissionDate as Date) between '${_formDate}' and '${_toDate}' and Active = 1
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getOpdAdmittedPatientList(_formDate: string, _toDate: string) {
    let _query = `
    select * from tblAppointment where CAST(StartDatetime as Date) between '${_formDate}' and '${_toDate}' and Active = 1
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveMenuWithSubMenuDetail(_reportMenuDetail: List) {
    let _req = this._commonServices.generateApiRequestParam(Constant.commonList.saveDetails, _reportMenuDetail);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.listController, _req);
  }

  getReportCollectionSidebarMenuList() {
    let _query = `select * from tblListitems where listtype like 'report-collection-sidebar-main-menu' and active = 1`;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getReportCollectionByQuery(_reportQuery: string) {
    let _query = _reportQuery;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
