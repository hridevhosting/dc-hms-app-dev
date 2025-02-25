import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';
import { List } from 'src/app/shared/modals/list';

@Injectable({
  providedIn: 'root'
})
export class RxManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getRxListbyAppointmentId(_appointmentId: number) {
    let _query = `
      select prescriptionid,medicine,dbo.nik_split(listParam,'|',1) as Doses,
      dbo.nik_split(listParam,'|',2) as Instruction,
      dbo.nik_split(listParam,'|',3) as Days,
      dbo.nik_split(listParam,'|',4) as Qty
      from tblprescription
      where active = 1 and  appointmentid = ${_appointmentId} order by prescriptionid asc;
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getMedicineList(_searchQuery?: string) {
    let param = {
      "strQuery": "",
      "QueryType": "GetList",
      "AvoidError": "",
      "inputJson": {
        "ListType": "Unclassified Meds",
        "userid": 0,
        "department": "",
        "Search": _searchQuery || ""
      },
      "Userid": this._commonServices.getCurrentSessionUserId() || 0
    }
    console.log(param);
    return this._httpClient.post<Response>(`${Constant.apiUrl}${Constant.listController}`, param)
  }

  // saveMedicineDetails(appointmentId: number, medName: string, medType: string, medDose: string, medDay: number, medQty: number) {
  //   let _query = `
  //     EXEC z usp_Prescription_Add_V6 862, N'PAN-D CAP', N'Unclassified Meds', N'|100| सकाळी जेवणाआधी|0|0.0|', 2, N'','','5',0;
  //   `;
  //   let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
  //   return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  //   // { "strQuery": "EXEC z usp_Prescription_Add_V6 862, N'PAN-D CAP', N'Unclassified Meds', N'|100| सकाळी जेवणाआधी|0|0.0|', 2, N'','','5',0; ", "QueryType": "#SQL#", "AvoidError": "", "inputJson": null, "UserId": 1 }

  // }

  saveAttributeValueByEntityAtrributeIdAttributeIdSetName(_attributeValue: string, _entityAttributeId: number, _attributeId: number, _setName: string) {
    let _query = `
    update tblentitysetattribute set AttributeValue=N'${_attributeValue}' where EntityAttributeId=${_entityAttributeId} ;
    DECLARE @Shift AS int
    declare @AttributeValue as nvarchar(max)
    Declare @AttributeId as int
    Declare @SetId int
    set @AttributeValue='${_attributeValue}'
    set @AttributeId=${_attributeId}
    SELECT @SetId = AttributeSetId FROM tblAttributeSet Where SetName = '${_setName}'
    SET @Shift=0
    select @Shift=count(*) from TBLATTRIBUTESETITEM where ATTRIBUTEID=@AttributeId and
    (COL1=@AttributeValue or COL2=@AttributeValue or COL3=@AttributeValue or COL4=@AttributeValue or COL5=@AttributeValue)
    if @Shift=0
    begin
    UPDATE TBLATTRIBUTESETITEM SET COL5=COL4 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL4=COL3 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL3=COL2 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL2=COL1 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL1=@AttributeValue WHERE ATTRIBUTEID=@AttributeId  and attributesetid=@SetId
    end
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.update, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveMedicineDetails(_caseId: number, _medName: string, _medType: string, medDose1: string, medDose2: string, extraInstruction: string, medDoseDay: number, medDoseQty: number, seqNo: number, version: number) {
    let _query = `EXEC usp_Prescription_Add_V6 ${_caseId}, N'${_medName}', N'${_medType}', N'|${medDose1 && medDose1 !== undefined ? medDose1 : ''}| ${medDose2} ${extraInstruction}|${medDoseDay}|${medDoseQty}|', ${seqNo}, N'','','${version}',0`;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveMedicineTranslatedLang(listDetails: List) {
    let _req = this._commonServices.generateApiRequestParam(Constant.commonList.saveDetails, listDetails);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.listController, _req);
  }

  getMedicineTranslatedLang() {
    let param = {
      "ListType": 'RX_MED_DOSE_TRAN_LANG',
      "userid": 0,
      "department": 'RX',
      "Search": ''
    };
    // let request = this._commonRequest.setParam(constant.commonList.getList,param,);
    // return this._httpClient.post(constant.apiUrl + constant.list, request );
    let _req = this._commonServices.generateApiRequestParam(Constant.commonList.getList, param);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.listController, _req);
  }

  deleteMedicineFromPrescriptionByPrescriptionIdAppointmentId(prescriptionId: number, appointmentId: number) {
    let _query = `update tblPrescription set active = 0 where prescriptionid = ${prescriptionId} and appointmentid = ${appointmentId};`
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


}
