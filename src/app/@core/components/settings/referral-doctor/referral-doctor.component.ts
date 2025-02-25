import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingManagementService } from 'src/app/@core/services/setting-management.service';
import { Response } from 'src/app/shared/modals/response';
import { Vendor } from 'src/app/shared/modals/vendor';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-referral-doctor',
    imports: [PrimeNgModule, CommonModule, FormsModule],
    templateUrl: './referral-doctor.component.html',
    styleUrl: './referral-doctor.component.css'
})
export class ReferralDoctorComponent implements OnInit {

  constructor(
    private _settingServices: SettingManagementService
  ) { }

  ngOnInit(): void {
    this.loadReferralDoctorList();
  }

  referralDoctorList: Vendor[] = [];

  loadReferralDoctorList() {
    this._settingServices.getReferralDoctorList().subscribe(
      (res: Response) => {
        console.log("getReferralDoctorList", res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.referralDoctorList = [];
          this.referralDoctorList = res.dataSet.Table;
          this.selectedReferralDoctorDetail = this.referralDoctorList[0];
          this.filterReferralDoctorListByFilter();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details');
      }
    )
  }

  index: number = 0;
  showList: boolean = false;
  selectedReferralDoctorDetail: Vendor = new Vendor();
  nextReferralDoctor() {
    this.selectedReferralDoctorDetail = new Vendor();
    if (this.index != this.referralDoctorList.length - 1) {
      this.index = this.index + 1;
    } else {
      this.index = 0;
    }
    this.selectedReferralDoctorDetail = this.referralDoctorList[this.index];
  }

  previousReferralDoctor() {
    this.selectedReferralDoctorDetail = new Vendor();
    if (this.index != 0) {
      this.index = this.index - 1;
    } else {
      this.index = this.referralDoctorList.length - 1;
    }
    this.selectedReferralDoctorDetail = this.referralDoctorList[this.index];
  }

  setSelectedReferralDoctorDetail(_detail: Vendor, _index: number) {
    this.selectedReferralDoctorDetail = new Vendor();
    this.selectedReferralDoctorDetail = _detail;
    this.index = _index;
    this.showList = false;
  }

  filteredReferralDoctorList: Vendor[] = [];
  filterReferralDoctorListByFilter(_query?: string, _filterType?: string) {

    //debugger

    let _filterList: Vendor[] = [];

    if (_query && this.referralDoctorList.length && _filterType) {
      for (let i = 0; i < this.referralDoctorList.length; i++) {
        let _referralDoctorDetail: any = null;
        _referralDoctorDetail = this.referralDoctorList[i];
        if (_filterType != undefined) {
          if (_referralDoctorDetail[_filterType.toString()]) {
            if ((_referralDoctorDetail[_filterType.toString()]).toLowerCase().includes(_query.toLowerCase())) {
              _filterList.push(_referralDoctorDetail);
            }
          }
        }
      }
      this.filteredReferralDoctorList = _filterList;
    } else {
      this.filteredReferralDoctorList = this.referralDoctorList;
    }

  }

  saveReferralDoctorDetail() {
    debugger
    this._settingServices.saveReferralDoctorDetails(this.selectedReferralDoctorDetail).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success')) {
          this.loadReferralDoctorList();
          this.setSelectedReferralDoctorDetail(this.referralDoctorList[0], 0)
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  addNew() {
    this.selectedReferralDoctorDetail = new Vendor()
  }

  selectedReferralDetailId: number = 0;
  deleteReferralDetail() {
    if(this.selectedReferralDetailId){
      this._settingServices.deleteReferralDetail(this.selectedReferralDetailId).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success')) {
            this.loadReferralDoctorList();
            this.setSelectedReferralDoctorDetail(this.referralDoctorList[0], 0);
            document.getElementById('hide')?.click()
          }
          if (res.Status.toLowerCase().includes('failed')) {
            this.loadReferralDoctorList();
            this.setSelectedReferralDoctorDetail(this.referralDoctorList[0], 0);
            document.getElementById('hide')?.click()
          }
        }, (err: Error) => {
          console.error(err);
      alert('Please try again, Check! ')
        }
      )
    } else {
      alert('Please try again!')
    }
  }

}
