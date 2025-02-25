import{b as t,c as m}from"./chunk-5JUHOLWQ.js";import{z as a}from"./chunk-N4ANQEKW.js";import{Q as s,V as l}from"./chunk-ZPID5U3R.js";var p={nik_Path_Report_Item_GetList:"nik_Path_Report_Item_GetList_v2"};var y=(()=>{class o{constructor(e,i){this._httpClient=e,this._commonServices=i}getPathTestListByCaseIdAndPatientId(e,i){let r=`
    select * from dbo.tblBillDetail
    where
    BillNo =
    ( select BillNo from tblBill
      where
            AppointmentId =
            ( select AppointmentId from dbo.tblAppointment
              where
              EntityId = ${e} and
              Description = 'AdmissionNO=${i}' and
              WhichOPD like 'pathology' and
              active = 1)
    and PatientId = ${e} and
    B_WhichOpd like 'pathology') and active = 1;
    `,n=this._commonServices.generateApiRequestParam(t.sqlFunNameList.select,null,r);return this._httpClient.post(t.apiUrl+t.sqlController,n)}getPathTestDetailByCaseIdAndPatientId(e,i){let r=`
      select * from tblBill
      where
      AppointmentId =
            ( select AppointmentId from dbo.tblAppointment
              where
              EntityId = ${e} and
              Description = 'AdmissionNO=${i}' and
              WhichOPD like 'pathology' and
              active = 1);
    `,n=this._commonServices.generateApiRequestParam(t.sqlFunNameList.select,null,r);return this._httpClient.post(t.apiUrl+t.sqlController,n)}getPathReportListByPatientIdPathId(e,i){let r=`
       select *  from tblPathReports where EntityId =${i} and PathLabid = '${e}' and Active = 1
  `,n=this._commonServices.generateApiRequestParam(t.sqlFunNameList.select,null,r);return this._httpClient.post(t.apiUrl+t.sqlController,n)}getPathReportListByPathIdPatientId(e,i,r,n){let c=`
        nik_Path_Report_GetList_v2
        '${this._commonServices.trasformDateTimeByFormat("dd MMM yyyy",e)}',
        N'${n||""}',
        '${i}',
        '${r}',
        '0',
        1;
  `,h=this._commonServices.generateApiRequestParam(t.sqlFunNameList.select,null,c);return this._httpClient.post(t.apiUrl+t.sqlController,h)}getPathReportItemListByPathReportDetail(e,i){let r=`
       EXEC ${p.nik_Path_Report_Item_GetList} ${e.PathReportId||0},${e.AppointmentId||0},${e.pkgid||0},'${e.PathLabId||""}','${i.PrimaryId1||""}','${i.PrimaryFld2||""}'
      `,n=this._commonServices.generateApiRequestParam(t.sqlFunNameList.select,null,r);return this._httpClient.post(t.apiUrl+t.sqlController,n)}getPathRegIdList(){let i=this._commonServices.generateApiRequestParam(t.sqlFunNameList.select,null,"select Value from Conf_txt where confname like '%PATH_RegistrationId%' and Active = 1;");return this._httpClient.post(t.apiUrl+t.sqlController,i)}static{this.\u0275fac=function(i){return new(i||o)(l(a),l(m))}}static{this.\u0275prov=s({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();export{y as a};
