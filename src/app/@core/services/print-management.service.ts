import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { PrintJobDetail } from 'src/app/shared/modals/print-job-detail';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrintManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  private generateCommandForPrint(_printJobDetail: PrintJobDetail) {
    return `'#Print#,print,${_printJobDetail.printerName},${_printJobDetail.patientId},${_printJobDetail.appointmentId},${_printJobDetail.whichOpd.toUpperCase()},${this._commonServices.getCurrentSessionUserId()},${_printJobDetail.reportName},${_printJobDetail.patientName}'`
  }

  savePrintJob(_printJobDetail: PrintJobDetail) {
    // _printJobDetail.reportName = 'Discharge Card HTML'
    let _query =
      `
    INSERT INTO [TblPrintJob]
           ([UserId]
           ,[PrinterName]
           ,[cmd]
           ,[isPrinted]
           ,[senderMachine]
           ,[Active]
           ,[RequestTime]
           ,[ExecutionTime]
           ,[patientid]
           ,[appointmentid]
           ,[whichopd]
           ,[reportname]
           ,[PatientName])
     VALUES
           (${this._commonServices.getCurrentSessionUserId()}
           ,'${_printJobDetail.printerName}'
           ,${this.generateCommandForPrint(_printJobDetail)}
           ,0
           ,'HMS-WEB-APP-V2.0'
           ,1
           ,'${this._commonServices.trasformDateTimeByFormat('dd MMM yyyy')}'
           ,''
           ,${_printJobDetail.patientId}
           ,${_printJobDetail.appointmentId}
           ,'${_printJobDetail.whichOpd}'
           ,'${_printJobDetail.reportName}'
           ,'${_printJobDetail.patientName}'
           );
           select @@identity;
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getDefaultReportDetailByUserId(_userId?: number) {
    let userId = _userId ? _userId : this._commonServices.getCurrentSessionUserId();
    let _query = `select * from CONF_Txt where ConfName like 'OPDDefaultReport${userId}';`;
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getTemplateList(hospitalSection?: string) {
    let _query = ``;
    if (hospitalSection?.toLowerCase() === 'ipd') {
      _query = `select * from tblReport where ReportName like '%html%' and  ReportName like '%discharge%' and Active = 1;`
    }
    if (hospitalSection?.toLowerCase() === 'opd') {
      _query = `select * from tblReport where ReportName like '%html%' and  ReportName like '%opd%' and Active = 1;`
    }
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getReportFile(_fileName: string) {
    // let _param = {
    //   "name": _fileName,
    // }
    let _param = {
      "name": _fileName+'.html',
    }
    let _serverIP = environment.printFilePathIP
    // return this._httpClient.post("http://" + _serverIP +":5034/api/CopyPasteFile/DownloadReportFile", _param);
    return this._httpClient.post("http://" + _serverIP + ":3000/api/get-file", _param);
    // return this._httpClient.get("http://localhost:3000/api/download-pdf");
  }

}
