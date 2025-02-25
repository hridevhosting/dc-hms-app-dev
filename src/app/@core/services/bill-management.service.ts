import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { HttpClient } from '@angular/common/http';
import { Response } from 'src/app/shared/modals/response';
import { environment } from 'src/environments/environment';
import { BillReceipt } from 'src/app/shared/modals/bill-receipt';
import { BillItemCharge } from 'src/app/shared/modals/bill-item-charge';

@Injectable({
  providedIn: 'root'
})
export class BillManagementService {

  constructor(
    private _commonService: CommonService,
    private _httpClient: HttpClient
  ) { }

  getBillListByPatientAndAppointmentId(_patientId: number, appointmentId: number, hospitalSection: string) {
    let _query = ''
    // if (hospitalSection.toLowerCase().includes('path')) {
    // _query = `
    // declare @pathAppointmentId int
    // select TOP 1 @pathAppointmentId = AppointmentId from tblAppointment where TreatmentPlanId = ${appointmentId} and WhichOPD like '${hospitalSection}%' order by AppointmentId desc
    // select *  from tblBill where PatientId = ${_patientId} and AppointmentId = @pathAppointmentId
    // `
    // } else {
    _query = `select * from dbo.tblBill where PatientId = ${_patientId} and B_WhichOpd like '${hospitalSection}%' order by BillNo desc `;
    // }

    // let _query = `select * from dbo.tblBill where PatientId = ${_patientId} and  AppointmentId >=  ${appointmentId} and B_WhichOpd like '${hospitalSection ? hospitalSection : environment.hospitalSection}%' order by BillNo desc `;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getBillDetailsByBillNo(billNo: number) {
    let _query = `EXEC usp_Bill_Get ${billNo}`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getBillDetailByCaseIdPatientIdHospitalSection(_caseId: number, _currentDate: string, _patientId: number, _hospitalSection: string) {
    let _query =
      `
      select 'nothing';

      Declare @billno int

      SELECT @billno =BILLNO FROM tblBill WHERE APPOINTMENTID=${_caseId} AND ACTIVE=1

      if @billno is null

      begin

      insert into tblbill(AppointmentId,IPCASENO,BILLDATE,patientid,Active )values(${_caseId},'<GetNextNo(bo,${_hospitalSection.toUpperCase()},True)>','${_currentDate}',${_patientId},1)

      select @billno=@@identity

      end

      EXEC usp_Bill_Get @billno;

      Declare @billno int

      SELECT @billno =BILLNO FROM tblBill WHERE APPOINTMENTID=${_caseId} AND ACTIVE=1

      if @billno is null

      begin

      insert into tblbill(AppointmentId,IPCASENO,BILLDATE,patientid,Active )values(${_caseId},'<GetNextNo(bo,${_hospitalSection.toUpperCase()},True)>','${_currentDate}',${_patientId},1)

      select @billno=@@identity

      end

      EXEC usp_Bill_GetDetail @billno,0;

      Declare @billno int

      SELECT @billno =BILLNO FROM tblBill WHERE APPOINTMENTID=${_caseId} AND ACTIVE=1

      if @billno is null

      begin

      insert into tblbill(AppointmentId,IPCASENO,BILLDATE,patientid,Active )values(${_caseId},'<GetNextNo(bo,${_hospitalSection.toUpperCase()},True)>','${_currentDate}',${_patientId},1)

      select @billno=@@identity

      end

      select @billno as billid;
    `
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getBillItemDetailsByBillNo(billNo: number) {
    let _query = `EXEC usp_Bill_GetDetail ${billNo}, 0`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getRecieptListByBillId(billId: number) {
    let _query = `select * from tblBillReceipt where BillNo = ${billId} and active = 1;`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveReceiptDetail(_receiptDetail: BillReceipt) {
    let _query = `
      usp_bill_Receipt_Add_v2
      '${_receiptDetail.BillReceiptId > 0 ? _receiptDetail.BillReceiptId : 0}',
      '${_receiptDetail.BillNo}',
      '${this._commonService.trasformDateTimeByFormat(_receiptDetail.TranDate, 'dd MMM yyyy')}',
      '${_receiptDetail.TranDesc}',
      '${_receiptDetail.Receipts}',
      '${_receiptDetail.TDSAmount}',
      '${_receiptDetail.PaymentMode}',
      '${this._commonService.trasformDateTimeByFormat(_receiptDetail.ChequeDate, 'dd MMM yyyy')}',
      '${_receiptDetail.IssuerBank}',
      '${_receiptDetail.ChequeNo}',
      '${this._commonService.getCurrentSessionUserId()}',
      '${_receiptDetail.Payer}',
      '${_receiptDetail.TPA}',
      '${_receiptDetail.ReceiptNo || this._commonService.trasformDateTimeByFormat(_receiptDetail.TranDate, 'dd MMM yyyy')}';
    `;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getRateTypeList() {
    let _query = `select ListItem from tbllistitems where ListType='BillCompany' and active=1 order by seqno; `;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getRateListByRateTypeRateSubType(_rateType: string, _rateSubType: string, _searchQuery?: string) {
    let _query = `EXEC nik_bill_Rate_List '${_rateType}' ,'${_rateSubType}', '${_searchQuery || ''}'; `;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


  getSubRateTypeList() {
    let _query = `select ListItem from tbllistitems where ListType='Bed Type' and active=1 order by seqno;`;
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveBillItemCharges(_billItemCharges: BillItemCharge) {
    let _query =
      `
    INSERT INTO [tblBillDetail]
    ([BillNo], [Code], [HeadDesc], [Date], [Rate], [Unit], [Amount], [Notes], [SeqNo], [Active], [RateId], [source])
    VALUES
    ('${_billItemCharges.BillNo}','${_billItemCharges.Code}','${_billItemCharges.HeadDesc}','${_billItemCharges.Date}','${_billItemCharges.Rate}','${_billItemCharges.Unit}','${_billItemCharges.Amount}','${_billItemCharges.Notes}','${_billItemCharges.SeqNo}','${_billItemCharges.Active}','${_billItemCharges.RateId}','${_billItemCharges.source}')
    `
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  deleteBillItem(_billItemId: number, _billNo: number, _reasonForDelete: string) {
    let _query = `update tblBillDetail set Active = 0, Notes = '${_reasonForDelete}' where BillDetailId = ${_billItemId} and BillNo = ${_billNo} and Active = 1;`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  deleteBillReceipt(_billIReceiptId: number, _billNo: number, _reasonForDelete: string) {
    let _query = `update tblBillReceipt set Active = 0, change_Remark = '${_reasonForDelete}', updatedAt = GETDATE() where BillReceiptId = ${_billIReceiptId} and BillNo = ${_billNo} and Active = 1;`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveReceiptDetailByBillNo(_billReceiptDetail: BillReceipt) {
    let _query = `
      usp_bill_Receipt_Add_v2
      '${_billReceiptDetail.BillReceiptId}',
      '${_billReceiptDetail.BillNo}',
      '${_billReceiptDetail.TranDate}',
      '${_billReceiptDetail.TranDesc}',
      '${_billReceiptDetail.Receipts}',
      '${_billReceiptDetail.TDSAmount}',
      '${_billReceiptDetail.PaymentMode}',
      '${_billReceiptDetail.ChequeDate}',
      '${_billReceiptDetail.IssuerBank}',
      '${_billReceiptDetail.ChequeNo}',
      '${_billReceiptDetail.EntryBy}',
      '${_billReceiptDetail.Payer}',
      '${_billReceiptDetail.TPA}',
      '${_billReceiptDetail.BillReceiptId ? _billReceiptDetail.ReceiptNo : _billReceiptDetail.TranDate}';
    `
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPathTestList(pathLabId?: string) {
    debugger
    let _query = `select * from tblpathtests where Active = 1 ${pathLabId ? 'and PathLabid like "%' + pathLabId + '%"' : ''};`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getRecentReceiptNo(_billType:string){
    let _query = `select Top 1 ReceiptNo  from tblBillReceipt where ReceiptNo like '%${_billType.toLowerCase()}%' order by BillReceiptId desc`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
