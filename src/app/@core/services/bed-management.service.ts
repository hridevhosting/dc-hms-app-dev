import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/shared/modals/constant';
import { Response } from 'src/app/shared/modals/response';

@Injectable({
  providedIn: 'root'
})
export class BedManagementService {

  constructor(
    private _commonService: CommonService,
    private _httpClient: HttpClient
  ) { }

  getUnAllotedBedList(floor?: string, bedType?: string) {
    // let _query = `select * from dbo.tblAdmissionBed where Active = 1 and OccupiedBy is null and OccupiedByName is null and OccupiedSince is null`
    let _query = `
      SELECT B.BedId, B.Description BedDesc, Location, T.Description BedType, B.Charges
	    FROM tblAdmissionBed B, tblAdmissionBedTYpe T

      WHERE T.BedTypeId = B.BedTypeId
			and T.Active = 1
			and B.Active =1

      ${bedType ? "and t.description='" + bedType + "'" : ''}
      ${floor ? "and B.location = '" + floor + "'" : ''}

      and bedid not in
      (
      SELECT ISNULL((select BedId from tblAdmissionBedHistory where AdmissionBedId = a.curr_AdmissionBedId), -1)
				FROM tblAdmission a
				WHERE a.Active = 1
				and a.status = 2
				and a.curr_AdmissionBedId is not null
			)
	    ORDER BY B.Description
    `
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getBedTypeList() {
    let _query = `select * from tblAdmissionBedType`
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  updateBedAllocation(admissionBedId: number, admissionId: number, bedId: number, charges: number, location: string, bedDesc: string, bedType: string) {
    let _query = `
            update tblAdmissionBedHistory
            set TimeTo='${this._commonService.trasformDateTimeByFormat("dd MMM yyyy HH:mm:ss", '')}'
            where AdmissionBedId = (select curr_admissionBedId from tblAdmission where AdmissionId = '${admissionId}')

            ${!admissionBedId ? 'INSERT INTO tblAdmissionBedHistory (AdmissionId, Bedid, TImeFrom, Charges, Active,bedName,bedType)' : ''}
            ${!admissionBedId ? "VALUES ( '" + admissionId + "', '" + bedId + "', '" + this._commonService.trasformDateTimeByFormat("dd MMM yyyy HH:mm:ss", '') + "', '" + charges + "', 1,'" + bedDesc + "','" + bedType + "')" : ''}

            ${admissionBedId ? 'UPDATE tblAdmissionBedHistory' : ''}
            ${admissionBedId ? "SET	AdmissionId = '" + admissionId + "'," : ''}
            ${admissionBedId ? "BedId = '" + bedId + "'," : ''}
            ${admissionBedId ? "TimeFrom = '" + this._commonService.trasformDateTimeByFormat("dd MMM yyyy HH:mm:ss", '') + "'," : ''}
            ${admissionBedId ? "Charges = '" + charges ? charges.toString() : 0 + "' " : ''}
            ${admissionBedId ? "WHERE AdmissionBedId = '" + admissionBedId + "' " : ''}

            Update tblAdmission SET Status = 2,location='${location}', curr_AdmissionBedid = @@identity where AdmissionId = '${admissionId}'
    `
    let _req = this._commonService.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }


}
