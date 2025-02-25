import{b as e,c as l}from"./chunk-6XXP7TRA.js";import{z as a}from"./chunk-N4ANQEKW.js";import{Q as o,V as s}from"./chunk-ZPID5U3R.js";var y=(()=>{class n{constructor(t,i){this._httpClient=t,this._commonServices=i}getPatientDetailsByPatientId(t){let i=`select * from tblEntity where EntityId = ${t} and Active = 1;`,r=this._commonServices.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,r)}getPatientDetailsByPatientPatientName_IPD_Dashboard(t){let i=`select EntityId, EntityName, RegNo, Active from tblEntity where EntityName like '${t.toLowerCase()}%';`,r=this._commonServices.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,r)}getPatient_IPD_OPD_PATH_History_Detail(t){let i=`

    --IPD Patient Admission History
    select 'IPD' as HospitalSectionName;
    select * from tblAdmission where PatientId = ${t.EntityId} and Active = 1 order by EntryDate desc

    --OPD Patient Appointment History
    select 'OPD' as HospitalSectionName;
    select * from tblAppointment where EntityId = ${t.EntityId} and Active = 1 and Description not like 'admissionno%' order by StartDatetime desc

    --Path Patient History
    select 'PATH' as HospitalSectionName;
    select * from tblAppointment where EntityId = ${t.EntityId} and Active = 1 and Description like 'admissionno%' order by StartDatetime desc

    `,r=this._commonServices.generateApiRequestParam(e.sqlFunNameList.select,null,i);return this._httpClient.post(e.apiUrl+e.sqlController,r)}static{this.\u0275fac=function(i){return new(i||n)(s(a),s(l))}}static{this.\u0275prov=o({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();export{y as a};
