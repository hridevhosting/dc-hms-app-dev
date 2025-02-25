import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DischargeSummaryManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }


  getDischargeSummary(_appointmentId: number) {
    // let _query = `EXEC mob_LoadPatientInvesstigation1 6257,1,'IPD','All'`
    let _dep = null;
    if (environment.hospitalSection) {
      _dep = environment.hospitalSection.toUpperCase()
    } else {
      if (history.state.hospitalSection) {
        _dep = history.state.hospitalSection.toUpperCase()
      } else {
        _dep = '';
      }
    }
    _dep = _dep.toLowerCase() === 'ipd' ? 'IPD' : _dep;
    let _query = `EXEC mob_LoadPatientInvesstigation1 ${_appointmentId},
                  ${this._commonServices.getCurrentSessionUserId()},
                  '${_dep}',
                  'All'`
    console.log(_query);
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getNoteSummary(_appointmentId: number, _noteSummary: string) {
    // let _query = `EXEC mob_LoadPatientInvesstigation1 6257,1,'IPD','All'`
    let _dep = null;
    if (environment.hospitalSection) {
      _dep = environment.hospitalSection.toUpperCase()
    } else {
      if (history.state.hospitalSection) {
        _dep = history.state.hospitalSection.toUpperCase()
      } else {
        _dep = '';
      }
    }
    _dep = _dep.toLowerCase() === 'ipd' ? 'IPD' : _dep;
    let _query = `
    EXEC nik_Appointment_Attribute_CopyUnUsed_V1 ${_appointmentId},'${_dep}', N'${_noteSummary}', ${this._commonServices.getCurrentSessionUserId()},'${_noteSummary}';\n
    EXEC mob_LoadPatientInvesstigation1 ${_appointmentId},
                  ${this._commonServices.getCurrentSessionUserId()},
                  '${_dep}',
                  'All'`
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getListByPrintGroupAttribute(_script: string) {
    let _query = _script
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveAttributeValueByEntityAtrributeIdAttributeIdSetName(_attributeValue: string, _entityAttributeId: number, _attributeId: number, _setName: string) {
    let _query = `
    UPDATE tblentitysetattribute set AttributeValue=N'${_attributeValue}' where EntityAttributeId=${_entityAttributeId} ;

    DECLARE @Shift AS int
    DECLARE @AttributeValue as nvarchar(max)
    DECLARE @AttributeId as int
    DECLARE @SetId int

    SET @AttributeValue='${_attributeValue}'
    SET @AttributeId=${_attributeId}
    SELECT @SetId = AttributeSetId FROM tblAttributeSet WHERE SetName = '${_setName}'
    SET @Shift=0

    SELECT @Shift=count(*) FROM TBLATTRIBUTESETITEM WHERE ATTRIBUTEID=@AttributeId and
    (COL1=@AttributeValue or COL2=@AttributeValue or COL3=@AttributeValue or
    COL4=@AttributeValue or COL5=@AttributeValue)

    if @Shift=0

    BEGIN

    UPDATE TBLATTRIBUTESETITEM SET COL5=COL4 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL4=COL3 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL3=COL2 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL2=COL1 WHERE ATTRIBUTEID=@AttributeId and attributesetid=@SetId
    UPDATE TBLATTRIBUTESETITEM SET COL1=@AttributeValue WHERE ATTRIBUTEID=@AttributeId  and attributesetid=@SetId

    END
    `

    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveNoteByEntityAtrributeIdAttributeIdSetName(_appointmentId: number, _patientId: number, _admissionId: number, _noteType: string) {

    let _query = `
    insert into tblAppointment
    (EntityId,IsRecurring, ShowTime, Importance,AllDayEvent,Description,Location,BookedFor,IsWalkin,Active,CreatedBy,CreatedAt,WhichOPD,StartDatetime,EndDatetime,Category,Notification,UpdatedAt,DeletedAt,Arrived,ArrivedAt,SendTo,SendAt,LeftHosp,LeftAt,TreatmentPlanId,Treatment,IsSync,RegNo,SeenBy,ApptRecNo,ApptRecDate,ReferredBy,IsCancelled,CancelledAt,CancelREason,CancelledBy,department,oldSoft,oldEncounterId)
    values
    (0,1,1,1,0,'${_noteType.toUpperCase()}',${_patientId},${_admissionId},0,1,1,GETDATE(),Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null,Null)
    `;

    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);

  }


}
