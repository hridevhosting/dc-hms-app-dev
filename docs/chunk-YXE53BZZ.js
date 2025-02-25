import{b as e,c as u}from"./chunk-6XXP7TRA.js";import{z as h}from"./chunk-N4ANQEKW.js";import{Q as a,V as o}from"./chunk-ZPID5U3R.js";var m=class{constructor(){this.BillNo=0,this.IPCaseNo="",this.PatientId=0,this.AppointmentId=0,this.PayerName="",this.TPA="",this.BillDate="",this.AdmissionDate="",this.DischargeDate="",this.PanNo="",this.BedNo="",this.TotalAmt=0,this.DiscountAmt=0,this.AmountToPayer=0,this.AmountToPatient=0,this.Active=0,this.Notes="",this.IsQuote=0,this.Locked=0,this.LockedBy=0,this.LockedAt="",this.CCNo="",this.issync=0,this.PATHLABID="",this.BillDepartment="",this.billCategory="",this.B_Department="",this.B_WhichOpd="",this.iskuberd=0,this.oldsoft="",this.oldbillId=0,this.oldInvoiceNo=0,this.oldEncounterId=0}};var c=class{constructor(){this.EntityId=0,this.EntityName="",this.AlternateName="",this.EntityTypeId=0,this.PrimaryId1="",this.PrimaryId2="",this.IdCreatedDate="",this.PrimaryFld1="",this.PrimaryFld2="",this.PrimaryFld3="",this.PrimaryFld4="",this.Active=0,this.CreatedBy=0,this.CreatedAt="",this.ExternalCategory="",this.IsSync=0,this.RegNo="",this.Payer="",this.TPA="",this.AadharCard="",this.Salutation="",this.GuardianName="",this.LMP="",this.Relation="",this.MaritalStatus="",this.AdditionalDetails="",this.hcn="",this.oldentityid="",this.State="",this.Country="",this.json=null,this.oldSoft="",this.creditsum=0,this.debitsum=0,this.CreditClosingbal=0,this.DebitClosingBal=0,this.dropebal=0,this.cropebal=0}};var B=(()=>{class n{constructor(t,i){this._commonService=t,this._httpClient=i}getBillListByPatientAndAppointmentId(t,i,l){let s="";s=`select * from dbo.tblBill where PatientId = ${t} and B_WhichOpd like '${l}%' order by BillNo desc `;let r=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,s);return this._httpClient.post(e.apiUrl+e.sqlController,r)}getBillDetailsByBillNo(t){let i=`EXEC usp_Bill_Get ${t}`,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}getBillDetailByCaseIdPatientIdHospitalSection(t,i,l,s){let r=`
      select 'nothing';

      Declare @billno int

      SELECT @billno =BILLNO FROM tblBill WHERE APPOINTMENTID=${t} AND ACTIVE=1

      if @billno is null

      begin

      insert into tblbill(AppointmentId,IPCASENO,BILLDATE,patientid,Active )values(${t},'<GetNextNo(bo,${s.toUpperCase()},True)>','${i}',${l},1)

      select @billno=@@identity

      end

      EXEC usp_Bill_Get @billno;

      Declare @billno int

      SELECT @billno =BILLNO FROM tblBill WHERE APPOINTMENTID=${t} AND ACTIVE=1

      if @billno is null

      begin

      insert into tblbill(AppointmentId,IPCASENO,BILLDATE,patientid,Active )values(${t},'<GetNextNo(bo,${s.toUpperCase()},True)>','${i}',${l},1)

      select @billno=@@identity

      end

      EXEC usp_Bill_GetDetail @billno,0;

      Declare @billno int

      SELECT @billno =BILLNO FROM tblBill WHERE APPOINTMENTID=${t} AND ACTIVE=1

      if @billno is null

      begin

      insert into tblbill(AppointmentId,IPCASENO,BILLDATE,patientid,Active )values(${t},'<GetNextNo(bo,${s.toUpperCase()},True)>','${i}',${l},1)

      select @billno=@@identity

      end

      select @billno as billid;
    `,p=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,r);return this._httpClient.post(e.apiUrl+e.sqlController,p)}getBillItemDetailsByBillNo(t){let i=`EXEC usp_Bill_GetDetail ${t}, 0`,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}getRecieptListByBillId(t){let i=`select * from tblBillReceipt where BillNo = ${t} and active = 1;`,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}saveReceiptDetail(t){let i=`
      usp_bill_Receipt_Add_v2
      '${t.BillReceiptId>0?t.BillReceiptId:0}',
      '${t.BillNo}',
      '${this._commonService.trasformDateTimeByFormat(t.TranDate,"dd MMM yyyy")}',
      '${t.TranDesc}',
      '${t.Receipts}',
      '${t.TDSAmount}',
      '${t.PaymentMode}',
      '${this._commonService.trasformDateTimeByFormat(t.ChequeDate,"dd MMM yyyy")}',
      '${t.IssuerBank}',
      '${t.ChequeNo}',
      '${this._commonService.getCurrentSessionUserId()}',
      '${t.Payer}',
      '${t.TPA}',
      '${t.ReceiptNo||this._commonService.trasformDateTimeByFormat(t.TranDate,"dd MMM yyyy")}';
    `,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}getRateTypeList(){let i=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,"select ListItem from tbllistitems where ListType='BillCompany' and active=1 order by seqno; ");return this._httpClient.post(e.apiUrl+e.sqlController,i)}getRateListByRateTypeRateSubType(t,i,l){let s=`EXEC nik_bill_Rate_List '${t}' ,'${i}', '${l||""}'; `,r=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,s);return this._httpClient.post(e.apiUrl+e.sqlController,r)}getSubRateTypeList(){let i=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,"select ListItem from tbllistitems where ListType='Bed Type' and active=1 order by seqno;");return this._httpClient.post(e.apiUrl+e.sqlController,i)}saveBillItemCharges(t){let i=`
    INSERT INTO [tblBillDetail]
    ([BillNo], [Code], [HeadDesc], [Date], [Rate], [Unit], [Amount], [Notes], [SeqNo], [Active], [RateId], [source])
    VALUES
    ('${t.BillNo}','${t.Code}','${t.HeadDesc}','${t.Date}','${t.Rate}','${t.Unit}','${t.Amount}','${t.Notes}','${t.SeqNo}','${t.Active}','${t.RateId}','${t.source}')
    `,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}deleteBillItem(t,i,l){let s=`update tblBillDetail set Active = 0, Notes = '${l}' where BillDetailId = ${t} and BillNo = ${i} and Active = 1;`,r=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,s);return this._httpClient.post(e.apiUrl+e.sqlController,r)}deleteBillReceipt(t,i,l){let s=`update tblBillReceipt set Active = 0, change_Remark = '${l}', updatedAt = GETDATE() where BillReceiptId = ${t} and BillNo = ${i} and Active = 1;`,r=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,s);return this._httpClient.post(e.apiUrl+e.sqlController,r)}saveReceiptDetailByBillNo(t){let i=`
      usp_bill_Receipt_Add_v2
      '${t.BillReceiptId}',
      '${t.BillNo}',
      '${t.TranDate}',
      '${t.TranDesc}',
      '${t.Receipts}',
      '${t.TDSAmount}',
      '${t.PaymentMode}',
      '${t.ChequeDate}',
      '${t.IssuerBank}',
      '${t.ChequeNo}',
      '${t.EntryBy}',
      '${t.Payer}',
      '${t.TPA}',
      '${t.BillReceiptId?t.ReceiptNo:t.TranDate}';
    `,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}getPathTestList(t){debugger;let i=`select * from tblpathtests where Active = 1 ${t?'and PathLabid like "%'+t+'%"':""};`,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}getRecentReceiptNo(t){let i=`select Top 1 ReceiptNo  from tblBillReceipt where ReceiptNo like '%${t.toLowerCase()}%' order by BillReceiptId desc`,l=this._commonService.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,l)}static{this.\u0275fac=function(i){return new(i||n)(o(u),o(h))}}static{this.\u0275prov=a({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();export{m as a,c as b,B as c};
