import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from 'src/app/shared/modals/constant';
import { CommonService } from './common.service';
import { Response } from 'src/app/shared/modals/response';
import { Vendor } from 'src/app/shared/modals/vendor';

@Injectable({
  providedIn: 'root'
})
export class SettingManagementService {

  constructor(
    private _httpClient: HttpClient,
    private _commonServices: CommonService
  ) { }

  getReferralDoctorList() {
    let _query = `
     select * from LAB_Vendor where VendorType like 'REFERRER' and VendorName <> '' and VendorName like 'dr%' and Active = 1 order by VendorName asc;
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  deleteReferralDetail(_vendorId: number) {
    let _query = `
     update LAB_Vendor set Active = 0 where VendorId = ${_vendorId} and Active = 1;
    `
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveReferralDoctorDetails(referralDoctorDetail: Vendor) {
    let _query = '';
    if (referralDoctorDetail.VendorId == -1) {
      _query =
        `
        declare @vendorId int
				set @vendorId = (select top 1 VendorId  from LAB_Vendor order by VendorId desc)
				set @vendorId  = @vendorId  + 1
				select @vendorId
        insert into LAB_Vendor (VendorId,VendorName,ContactNo,TelNo,Address,ContactName,Alias,CreatedBy,CreatedAt,VendorType,VendorSubType,Active)
				values (@vendorId,  N'${referralDoctorDetail.VendorName}', N'${referralDoctorDetail.ContactNo ? referralDoctorDetail.ContactNo : ''}', N'${referralDoctorDetail.TelNo ? referralDoctorDetail.TelNo : ''}', N'${referralDoctorDetail.Address}',N'${referralDoctorDetail.ContactName}', N'${referralDoctorDetail.Alias}', N'${referralDoctorDetail.CreatedBy ? referralDoctorDetail.CreatedBy : this._commonServices.getCurrentSessionUserId()}', N'${this._commonServices.trasformDateTimeByFormat()}', 'REFERRER', 'REFERRER',1);
      `
    }
    if (referralDoctorDetail.VendorId > 0) {
      _query =
        `
      update
			LAB_Vendor
		set
			VendorName = N'${referralDoctorDetail.VendorName}',
			ContactName = N'${referralDoctorDetail.ContactName}',
			Address = N'${referralDoctorDetail.Address}',
			ContactNo = N'${referralDoctorDetail.ContactNo}',
			TelNo = N'${referralDoctorDetail.TelNo}',
			Alias = N'${referralDoctorDetail.Alias}',
			Active = N'${referralDoctorDetail.Active}'
		where
			VendorId = ${referralDoctorDetail.VendorId}
      `
    }
    let _req = this._commonServices.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

}
