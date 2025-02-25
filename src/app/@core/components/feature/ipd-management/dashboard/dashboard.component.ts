import { Component, DoCheck, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { IpdManagementService } from 'src/app/@core/services/ipd-management.service';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { environment } from 'src/environments/environment';
import { BedAllocationManagementComponent } from '../../bed-allocation-management/bed-allocation-management.component';
import { BillingManagementComponent } from '../../billing-management/billing-management.component';
import { BillingListComponent } from '../../billing-list/billing-list.component';
import { AdmissionHistoryComponent } from '../../admission-history/admission-history.component';
import { CommonService } from 'src/app/@core/services/common.service';
import { IpdPatientList } from 'src/app/shared/modals/ipd-patient-list';
import { IpdManagementPatientList } from 'src/app/shared/modals/ipd-management-patient-list';
import { IpdManagementPatientFilterList } from 'src/app/shared/modals/ipd-management-patient-filter-list';
import { AdmissionService } from 'src/app/@core/services/admission.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { PathReportDetailComponent } from '../../path-report-detail/path-report-detail.component';
import { List } from 'src/app/shared/modals/list';
import { PathManagementService } from 'src/app/@core/services/path-management.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CombinedPatientSearchComponent } from 'src/app/shared/components/combined-patient-search/combined-patient-search.component';

class PathReportDateWiseDetail {
  date: string = '';
  dataArray: any[] = [];
}

class SearchedPatientDetail {
  EntityId: number = 0;
  EntityName: string = '';
  RegNo: string = '';
  Active: number = 0;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, DoCheck {

  constructor(
    private _ipdServices: IpdManagementService,
    private _addmissionService: AdmissionService,
    private _patientService: PatientManagementService,
    public _dialogService: DialogService,
    private _commonService: CommonService,
    private _pathManagementServices: PathManagementService,
    private _router: Router
  ) { }

  ngDoCheck(): void {
    this.item;
  }

  items: MenuItem[] = [];
  visibleFilterDialog: boolean = false;
  visibleAdditionalOptionsDialog: boolean = false;
  isCustomDate: string = '0';
  item: any[] = []

  home: any = null;
  isToday: number = 0;
  floorList: string[] = [];
  roomTypeList: string[] = [];
  procedureList: string[] = [];
  doctorList: any[] = [];
  referralDoctorList: any[] = [];
  showMoreDetail: boolean = false;
  showPathReportListDateWise: boolean = false;

  ngOnInit() {
    //debugger
    this._commonService.setHospitalSection('IPD Management');
    environment.hospitalSection = 'ipd';
    history.state.hospitalSection = 'ipd';
    this.item = [
      { label: this.patientStatus },
      { label: this.selectedFilterType },
      { label: this.selectedSortingType ? this.selectedSortingType : 'All' }
    ];

    this.home = { label: '' };
    let _currentSystemDate: any = new Date();
    _currentSystemDate = this._commonService.trasformDateTimeByFormat()?.split('T')[0];
    if (!this.fromDate && !this.toDate) {
      this.fromDate = _currentSystemDate;
      this.toDate = _currentSystemDate;
    }
    this.loadAddmittedPatientList();
    this.loadReferralDoctorList();
    this.loadPathRegId();
    // this.items = [
    //   {
    //     label: 'File',
    //     icon: 'pi pi-fw pi-file',
    //     items: [
    //       {
    //         label: 'New',
    //         icon: 'pi pi-fw pi-plus',
    //         items: [
    //           {
    //             label: 'Bookmark',
    //             icon: 'pi pi-fw pi-bookmark'
    //           },
    //           {
    //             label: 'Video',
    //             icon: 'pi pi-fw pi-video'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Delete',
    //         icon: 'pi pi-fw pi-trash'
    //       },
    //       {
    //         separator: true
    //       },
    //       {
    //         label: 'Export',
    //         icon: 'pi pi-fw pi-external-link'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Edit',
    //     icon: 'pi pi-fw pi-pencil',
    //     items: [
    //       {
    //         label: 'Left',
    //         icon: 'pi pi-fw pi-align-left'
    //       },
    //       {
    //         label: 'Right',
    //         icon: 'pi pi-fw pi-align-right'
    //       },
    //       {
    //         label: 'Center',
    //         icon: 'pi pi-fw pi-align-center'
    //       },
    //       {
    //         label: 'Justify',
    //         icon: 'pi pi-fw pi-align-justify'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Users',
    //     icon: 'pi pi-fw pi-user',
    //     items: [
    //       {
    //         label: 'New',
    //         icon: 'pi pi-fw pi-user-plus'
    //       },
    //       {
    //         label: 'Delete',
    //         icon: 'pi pi-fw pi-user-minus'
    //       },
    //       {
    //         label: 'Search',
    //         icon: 'pi pi-fw pi-users',
    //         items: [
    //           {
    //             label: 'Filter',
    //             icon: 'pi pi-fw pi-filter',
    //             items: [
    //               {
    //                 label: 'Print',
    //                 icon: 'pi pi-fw pi-print'
    //               }
    //             ]
    //           },
    //           {
    //             icon: 'pi pi-fw pi-bars',
    //             label: 'List'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Events',
    //     icon: 'pi pi-fw pi-calendar',
    //     items: [
    //       {
    //         label: 'Edit',
    //         icon: 'pi pi-fw pi-pencil',
    //         items: [
    //           {
    //             label: 'Save',
    //             icon: 'pi pi-fw pi-calendar-plus'
    //           },
    //           {
    //             label: 'Delete',
    //             icon: 'pi pi-fw pi-calendar-minus'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Archieve',
    //         icon: 'pi pi-fw pi-calendar-times',
    //         items: [
    //           {
    //             label: 'Remove',
    //             icon: 'pi pi-fw pi-calendar-minus'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     separator: true
    //   },
    //   {
    //     label: 'Quit',
    //     icon: 'pi pi-fw pi-power-off'
    //   }
    // ];

    this.filterTypeList.push('Floor');
    this.filterTypeList.push('Room Type');
    this.filterTypeList.push('Procedure');
    this.filterTypeList.push('Doctor');
    this.filterTypeList.push('Referral Doctor');

    this.patientStatusTypeList.push('Admitted');
    this.patientStatusTypeList.push('Discharge');

    this.screenHeight = environment.screenHeight;
    this.screenWidth = environment.screenWidth;

    // this.showCombinedPatientSearchDetail();
  }

  updateBreadcrump1() {
    //debugger
    if (this.isCustomDate === "1") {
      this.item[0].label = 'Today'
      this.fromDate = this._commonService.trasformDateTimeByFormat()?.split('T')[0].toString() || '';
      this.toDate = this._commonService.trasformDateTimeByFormat()?.split('T')[0].toString() || '';
      this.loadPatientListByPatientStatus();
    } else if (this.isCustomDate === "2") {
      this.item[0].label = 'Custom'
    } else {
      this.item[0].label = 'All'
      this.isCustomDate === "2"
      this.loadPatientListByPatientStatus();
    }
  }

  resetFilters(){
    this.fromDate = this._commonService.trasformDateTimeByFormat()?.split('T')[0].toString() || '';
    this.toDate = this._commonService.trasformDateTimeByFormat()?.split('T')[0].toString() || '';
    this.isCustomDate = "1";
    this.searchedPatientName = '';
    this.loadPatientListByPatientStatus();
  }

  ipdAddmittedPatientList: IpdManagementPatientList[] = [];
  screenHeight: number = 0;
  screenWidth: number = 0;
  moreDetails: boolean = false;
  selectedIpdDetails: any = null;
  filterTypeList: string[] = [];
  patientStatusTypeList: string[] = [];
  fromDate: string = '';
  toDate: string = '';
  patientStatus: string = 'All';
  selectedFilterType: string = 'Floor';

  searchedPatientList: SearchedPatientDetail[] = [];
  loadPatientList(_searchQuery: string) {
    if (_searchQuery || this.searchedPatientName) {
      this._patientService.getPatientDetailsByPatientPatientName_IPD_Dashboard(_searchQuery || this.searchedPatientName).subscribe(
        (res: Response) => {
          console.log("Serched Patient List =>", res);
          if (res.Status.toLowerCase().trim().includes('success') && res.noofREcords) {
            this.searchedPatientList = [];
            this.searchedPatientList = res.dataSet.Table;
            console.log("Searched =>", this.searchedPatientList);
          }
        }, (err: Error) => {
          console.error(err);
        }
      )
    }
  }

  loadAddmittedPatientList() {
    this._commonService.activeLoader()
    this._ipdServices.getAddmittedPaitentListForIPD(Number(this.isCustomDate) > 0 ? this.fromDate : '', Number(this.isCustomDate) > 0 ? this.toDate : '').subscribe(
      (res: Response) => {
        console.log(res);
        this._commonService.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {

          this.ipdAddmittedPatientList = [];
          this.ipdAddmittedPatientList = res.dataSet.Table;

          this.doctorList = [];
          this.doctorList = res.dataSet.Table1;

          if (res.dataSet.Table2.length) {
            this.floorList = [];
            res.dataSet.Table2.forEach((z: any) => {
              this.floorList.push(z.Location);
            });;
          }

          if (res.dataSet.Table3.length) {
            this.roomTypeList = [];
            res.dataSet.Table3.forEach((z: any) => {
              this.roomTypeList.push(z.Description);
            });;
          }

          if (res.dataSet.Table4.length) {
            this.procedureList = [];
            res.dataSet.Table4.forEach((z: any) => {
              this.procedureList.push(z.procadviced);
            });;
          }

          if (res.dataSet.Table5.length) {
            this.referralDoctorList = [];
            res.dataSet.Table5.forEach((z: any) => {
              this.referralDoctorList.push(z.ListItem);
            });;
          }

          this.filterIpdPatientListBySelectedSortingType();

          console.log(this.ipdAddmittedPatientList);
          console.log(this.doctorList);
          console.log(this.floorList);
          console.log(this.procedureList);
          console.log(this.roomTypeList);
          console.log(this.referralDoctorList);
        }
        if (res.Status.toLowerCase().includes('success') && !res.noofREcords) {
          this.ipdAddmittedPatientList = [];
          // this.ipdAddmittedPatientList = res.dataSet.Table;
          this.sortSelectedFilterTypeArrayDataByFilterType()
          console.log(this.ipdAddmittedPatientList);
        }
      }, (err: Error) => {
        console.error(err);
        this._commonService.deactiveLoader();
      }
    )
  }

  loadPatientListByCustomDate(_patientNumber?: number) {
    this._commonService.activeLoader()
    this._ipdServices.getPaitentListForIPD(Number(this.isCustomDate) > 0 ? this.fromDate : '', Number(this.isCustomDate) > 0 ? this.toDate : '', _patientNumber || 0).subscribe(
      (res: Response) => {
        console.log(res);
        this._commonService.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {

          this.ipdAddmittedPatientList = [];
          this.filteredIpdPatientList = [];
          this.ipdAddmittedPatientList = res.dataSet.Table;

          this.doctorList = [];
          this.doctorList = res.dataSet.Table1;

          if (res.dataSet.Table2.length) {
            this.floorList = [];
            res.dataSet.Table2.forEach((z: any) => {
              this.floorList.push(z.Location);
            });;
          }

          if (res.dataSet.Table3.length) {
            this.roomTypeList = [];
            res.dataSet.Table3.forEach((z: any) => {
              this.roomTypeList.push(z.Description);
            });;
          }

          if (res.dataSet.Table4.length) {
            this.procedureList = [];
            res.dataSet.Table4.forEach((z: any) => {
              this.procedureList.push(z.procadviced);
            });;
          }

          if (res.dataSet.Table5.length) {
            this.referralDoctorList = [];
            res.dataSet.Table5.forEach((z: any) => {
              this.referralDoctorList.push(z.ListItem);
            });;
          }

          this.filterIpdPatientListBySelectedSortingType();

          console.log(this.ipdAddmittedPatientList);
          console.log(this.doctorList);
          console.log(this.floorList);
          console.log(this.procedureList);
          console.log(this.roomTypeList);
          console.log(this.referralDoctorList);
        }
        if (res.Status.toLowerCase().includes('success') && !res.noofREcords) {
          this.ipdAddmittedPatientList = [];
          // this.ipdAddmittedPatientList = res.dataSet.Table;
          this.sortSelectedFilterTypeArrayDataByFilterType()
          console.log(this.ipdAddmittedPatientList);
        }
      }, (err: Error) => {
        console.error(err);
        this._commonService.deactiveLoader();
      }
    )
  }

  loadDischardedPatientList() {
    this._commonService.activeLoader()
    this._ipdServices.getDischargedPaitentListForIPD(Number(this.isCustomDate) > 0 ? this.fromDate : '', Number(this.isCustomDate) > 0 ? this.toDate : '').subscribe(
      (res: Response) => {
        console.log(res);
        this._commonService.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.ipdAddmittedPatientList = [];
          this.ipdAddmittedPatientList = res.dataSet.Table;
          this.filterIpdPatientListBySelectedSortingType()
          console.log(this.ipdAddmittedPatientList);
        }
        if (res.Status.toLowerCase().includes('success') && !res.noofREcords) {
          this.ipdAddmittedPatientList = [];
          this.filterIpdPatientListBySelectedSortingType()
          console.log(this.ipdAddmittedPatientList);
        }
      }, (err: Error) => {
        console.error(err);
        this._commonService.deactiveLoader();
      }
    )
  }

  isDirectSearch: boolean = false;
  loadPatientListByPatientStatus() {
    debugger
    this.item[1].label = this.patientStatus;
    if (this.patientStatus.toLowerCase().includes('admit') && this.fromDate === this.toDate) {
      this.loadAddmittedPatientList()
    }
    if (this.patientStatus.toLowerCase().includes('discharge') && this.fromDate === this.toDate) {
      this.loadDischardedPatientList()
    }
    if (this.patientStatus.toLowerCase().includes('all') || this.fromDate !== this.toDate) {
      this.isCustomDate = '2';
      this.loadPatientListByCustomDate()
    }
    if (this.isDirectSearch) {
      this.isCustomDate = '2';
      this.loadPatientListByCustomDate()
    }
  }

  selectedFilterTypeArrayData: string[] = [];
  selectedSortingType: string = '';
  selectedSubFilterType: string = '';
  filteredIpdPatientList: IpdManagementPatientList[] = [];
  showAlertPopup: boolean = false;
  sortSelectedFilterTypeArrayDataByFilterType() {
    debugger
    this._commonService.activeLoader()
    setTimeout(() => {
      this.filteredIpdPatientList = [];
      if (this.ipdAddmittedPatientList.length) {
        let _objectKeys = Object.keys(this.ipdAddmittedPatientList[0]);
        let _list: IpdManagementPatientList[] = []
        if (this.selectedSubFilterType || this.searchedPatientName) {
          this.ipdAddmittedPatientList.forEach(
            (z: any) => {
              // debugger
              if (z[this.ipdFilterTypeList.filterKeyValue].toLowerCase() === this.selectedSubFilterType.toLowerCase() && !this.searchedPatientName) {
                _list.push(z);
              }
              if (z[this.ipdFilterTypeList.filterKeyValue].toLowerCase() === this.selectedSubFilterType.toLowerCase() && z?.EntityName.trim().toLowerCase().includes(this.searchedPatientName.trim().toLowerCase())) {
                _list.push(z);
              }
              if (!this.selectedSubFilterType.toLowerCase() && z?.EntityName.trim().toLowerCase().includes(this.searchedPatientName.trim().toLowerCase())) {
                _list.push(z);
              }
            }
          )
          debugger
          this.filteredIpdPatientList = _list;
          if (!this.filteredIpdPatientList.length && this.searchedPatientName) {
            this.showAlertPopup = true;
          }
        } else {
          this.filteredIpdPatientList = this.ipdAddmittedPatientList;
        }
        this._commonService.deactiveLoader()
      }
      else {
        this.filteredIpdPatientList = this.ipdAddmittedPatientList;
      }
      this._commonService.deactiveLoader()
      console.log("Filtered Patient =>", this.filteredIpdPatientList);
    }, 1000);

  }

  setAndSearchPatientDetailByPatientName(_patientName: string) {
    this.searchedPatientName = _patientName.toUpperCase();
    // this.sortSelectedFilterTypeArrayDataByFilterType();
    this.searchedPatientList = [];
  }

  searchedPatientName: string = ''
  ipdFilterTypeList: IpdManagementPatientFilterList = new IpdManagementPatientFilterList();
  selectedFilterVal: string = ''
  filterIpdPatientListBySelectedSortingType() {
    debugger
    // let _list: any[] = [];
    // _list = this.ipdAddmittedPatientList;
    this.ipdFilterTypeList.filterValueList = []
    if (this.selectedFilterType) {
      this.ipdFilterTypeList.filterType = this.selectedFilterType;
      // for (let i = 0; i < this.filterTypeList.length; i++) {
      if (this.selectedFilterType.toLowerCase() === 'floor') {
        // if (_list[i].ProcAdviced.toLowerCase() === this.selectedSortingType.toLowerCase()) {
        this.ipdFilterTypeList.filterValueList = this.floorList;
        this.ipdFilterTypeList.filterKeyValue = 'location';
        this.ipdFilterTypeList.filterValue = 'location';
        // }
      }
      if (this.selectedFilterType.toLowerCase() === 'room type') {
        // if (_list[i].Location.toLowerCase() === this.selectedSortingType.toLowerCase()) {
        this.ipdFilterTypeList.filterValueList = this.roomTypeList;
        this.ipdFilterTypeList.filterKeyValue = 'BedType';
        this.ipdFilterTypeList.filterValue = 'Bed';
        // }
      }
      if (this.selectedFilterType.toLowerCase() === 'procedure') {
        // if (_list[i].ReferredBy.toLowerCase() === this.selectedSortingType.toLowerCase()) {
        this.ipdFilterTypeList.filterValueList = this.procedureList;
        this.ipdFilterTypeList.filterKeyValue = 'ProcAdviced';
        this.ipdFilterTypeList.filterValue = 'ProcAdviced';
        // }
      }
      if (this.selectedFilterType.toLowerCase() === 'doctor') {
        // if (_list[i].ProcAdviced.toLowerCase() === this.selectedSortingType.toLowerCase()) {
        this.ipdFilterTypeList.filterValueList = this.doctorList.length ? [] : []
        this.doctorList.length ? this.doctorList.forEach((z: any) => { if (z.UserName) { this.ipdFilterTypeList.filterValueList.push(z.UserName) } }) : null;
        this.ipdFilterTypeList.filterKeyValue = 'Consultant';
        this.ipdFilterTypeList.filterValue = 'Doctor';
        // }
      }
      if (this.selectedFilterType.toLowerCase() === 'referral doctor') {
        // if (_list[i].ProcAdviced.toLowerCase() === this.selectedSortingType.toLowerCase()) {
        this.ipdFilterTypeList.filterValueList = this.referralDoctorList.length ? [] : [];
        this.referralDoctorList.length ? this.referralDoctorList.forEach((z: List) => { if (z.ListItem) { this.ipdFilterTypeList.filterValueList.push(z.ListItem) } }) : null;
        this.ipdFilterTypeList.filterKeyValue = 'ReferredBy';
        this.ipdFilterTypeList.filterValue = 'referral doctor';
        // }
      }
      // }
    } else {
      this.ipdFilterTypeList.filterType = this.selectedFilterType;
      this.ipdFilterTypeList.filterValue = '';
      this.ipdFilterTypeList.filterValueList = this.ipdAddmittedPatientList
    }
    console.log(this.ipdFilterTypeList);
    this.sortSelectedFilterTypeArrayDataByFilterType();

  }

  showDetailsOfIpdPatient(patientDetails: any) {
    this.selectedIpdDetails = null;
    this.selectedIpdDetails = patientDetails;
    if (this.selectedIpdDetails) {
      this.loadPatientDetailByPatientId();
      this.loadAdmissionDetailsByPatientIdAdmissionId();
    } else {
      alert('Please retry.')
    }
    console.log(this.selectedIpdDetails);
  }

  showBedAllocationDialoge() {
    console.log(this.selectedIpdDetails);

    let ref = this._dialogService.open(BedAllocationManagementComponent, {
      header: 'Bed Allocation for ' + this.selectedIpdDetails.EntityName.toUpperCase(),
      width: '60%',
      data: {
        admissionId: this.selectedIpdDetails.AppointmentId
      }
    })
  }

  showAdmissionHistoryForIpdPatientDialoge() {
    history.state.patientId = this.selectedIpdDetails ? this.selectedIpdDetails.EntityId : 0;
    let ref = this._dialogService.open(AdmissionHistoryComponent, {
      header: 'Admission History',
      width: 'auto',
      data: {
        admissionId: this.selectedIpdDetails.AppointmentId,
        type: 'discharge summary'
      }
    })
  }

  showDoctorNotesHistoryForIpdPatientDialoge() {
    history.state.patientId = this.selectedIpdDetails ? this.selectedIpdDetails.EntityId : 0;
    let ref = this._dialogService.open(AdmissionHistoryComponent, {
      header: 'Admission History',
      width: 'auto',
      data: {
        admissionId: this.selectedIpdDetails.AppointmentId,
        type: 'doctor notes'

      }
    })
  }


  showSisterNotesHistoryForIpdPatientDialoge() {
    history.state.patientId = this.selectedIpdDetails ? this.selectedIpdDetails.EntityId : 0;
    let ref = this._dialogService.open(AdmissionHistoryComponent, {
      header: 'Admission History',
      width: 'auto',
      data: {
        admissionId: this.selectedIpdDetails.AppointmentId,
        type: 'sister notes'

      }
    })
  }


  showBillDialoge() {
    let ref = this._dialogService.open(BillingListComponent, {
      header: 'Bill List - \n' + this.selectedIpdDetails.EntityName.toUpperCase(),
      width: this.validPlatform('iphone') ? '100%' : '50%',
      data: {
        ipdPatientDetail: this.selectedIpdDetails,
        billType: 'ipd'
      }
    })
  }

  showPathBillDialoge() {
    let ref = this._dialogService.open(BillingListComponent, {
      header: 'Path Bill List - \n' + this.selectedIpdDetails.EntityName.toUpperCase(),
      width: this.validPlatform('iphone') ? '100%' : '50%',
      data: {
        ipdPatientDetail: this.selectedIpdDetails,
        billType: 'path'
      }
    })
  }

  showPathTestDialoge() {
    //debugger
    if (this.selectedIpdDetails.EntityId) {
      history.state.patientId = this.selectedIpdDetails.EntityId;
      history.state.caseDetail = this.selectedIpdDetails;
      let ref = this._dialogService.open(PathReportDetailComponent, {
        header: 'Path Test List - \n' + this.selectedIpdDetails.EntityName.toUpperCase(),
        width: this.validPlatform('iphone') ? '100%' : '50%',
        height: this.validPlatform('iphone') ? '100%' : 'auto',
        data: {
          ipdPatientDetail: this.selectedIpdDetails,
          billType: 'path'
        }
      })
    }
  }


  wrapupExtraProcedureText(_textValue: string) {
    let _returnValue: string = ''
    if (_textValue) {
      if (_textValue.length > 40) {
        for (let i = 0; i < 45; i++) {
          if (i <= 43) {
            _returnValue = _returnValue + _textValue[i];
          } else {
            _returnValue = _returnValue + '...'
          }
        }
      } else {
        _returnValue = _textValue
      }
    }
    return _returnValue;
  }

  loadReferralDoctorList() {
    this._commonService.activeLoader();
    this._commonService.getRefrralDoctorList().subscribe(
      (res: Response) => {
        console.log(res);
        this._commonService.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.referralDoctorList = [];
          this.referralDoctorList = res.dataSet.Table;
        }
      }, (err: Error) => {
        this._commonService.deactiveLoader();
        console.error(err);
      }
    )
  }

  selectedIpdpatientDetails: any = null;
  loadPatientDetailByPatientId() {
    if (this.selectedIpdDetails) {
      this._patientService.getPatientDetailsByPatientId(this.selectedIpdDetails.EntityId).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            this.selectedIpdpatientDetails = null;
            this.selectedIpdpatientDetails = res.dataSet.Table[0];
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more details.')
        }
      )
    } else {
      alert('Please retry.')
    }
  }

  selectedIpdAdmissionDetails: any = null;
  loadAdmissionDetailsByPatientIdAdmissionId() {
    if (this.selectedIpdDetails) {
      this._addmissionService.getAddmissionDetailsByAdmissionIdPatientId(this.selectedIpdDetails.EntityId, this.selectedIpdDetails.admissionid).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            this.selectedIpdAdmissionDetails = null;
            this.selectedIpdAdmissionDetails = res.dataSet.Table[0];
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more details.')
        }
      )
    } else {
      alert('Please retry.')
    }
  }

  validFilterType(_filterType: string, filterKeyValue: string, ipdDetail: any) {
    // let _objectKeyList = Object.keys(ipdDetail);

    if (ipdDetail[filterKeyValue].toLowerCase() === _filterType.toLowerCase()) {
      return true;
    } else {
      return false;
    }

  }

  checkCount(_filterType: string, _filterKeyValue: string) {
    //debugger
    if (this.ipdAddmittedPatientList.length) {
      let _count: number = 0;
      this.ipdAddmittedPatientList.forEach(
        (z: any) => {
          // //debugger
          // try {
          if (z[_filterKeyValue].toLowerCase() === _filterType.toLowerCase()) {
            _count = _count + 1;
            // throw new Error('Found Count');
          }
          // } catch (err) {
          // throw new Error('Found Count')
          // }
        }
      )
      // //debugger
      if (_count) {
        return _count;
      } else {
        return _count;
      }
    } else {
      return 0;
    }
  }

  validCount(_filterType: string, _filterKeyValue: string) {
    debugger
    if (this.filteredIpdPatientList.length) {
      let _count: number = 0;
      this.filteredIpdPatientList.forEach(
        (z: any) => {
          //debugger
          // try {
          if (z) {
            if (z[_filterKeyValue].toLowerCase() === _filterType.toLowerCase()) {
              _count = _count + 1;
              // throw new Error('Found Count');
            }
          }
          // } catch (err) {
          // throw new Error('Found Count')
          // }
        }
      )
      debugger
      if (_count) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  validSubFilter(_filter: string) {
    //debugger
    if (_filter.toLowerCase() === this.selectedSubFilterType.toLowerCase() || !this.selectedSubFilterType) {
      return true;
    } else {
      return false;
    }
  }

  return_PatientStatus(_ipdDetail: any) {
    let _res: string = '';
    if (_ipdDetail) {
      if (_ipdDetail.AdmissionDate && _ipdDetail.DischargeDate) {
        _res = 'Discharged'
      }
      else if (_ipdDetail.AdmissionDate && !_ipdDetail.DischargeDate) {
        _res = 'Admitted'
      } else {
        _res = ''
      }
    }
    return _res;
  }


  validPlatform(_query: string) {
    return this._commonService.checkPlatform(_query);
  }

  reasonForDischargePaitent: string = ''

  pathLabId: string = 'critizone'
  pathReportList: any[] = [];
  pathReportDate: string = '';
  pathReportDateWiseList: PathReportDateWiseDetail[] = []
  loadPatReportListByPatientIdPathId() {
    this._pathManagementServices.getPathReportListByPatientIdPathId(this.pathLabId, this.selectedIpdDetails.EntityId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.pathReportDateWiseList = [];
          let _data: any[] = res.dataSet.Table;
          let _param: PathReportDateWiseDetail = new PathReportDateWiseDetail();
          _data.forEach(
            (z: any) => {
              debugger
              let _date = z.RequestDate || '';
              if (_date) {
                if (!_param.date) {
                  _param.date = this._commonService.trasformDateTimeByFormat('yyyy-MM-dd', _date) || '';
                }

                if (!this.pathReportDateWiseList.length) {
                  if (_param.date && !_param.dataArray.length) {
                    _param.dataArray.push(z);
                  } else {
                    if (_param.date) {
                      if (_param.date === this._commonService.trasformDateTimeByFormat('yyyy-MM-dd', z.RequestDate)) {
                        _param.dataArray.push(z);
                      } else {
                        if (_param.dataArray.length) {
                          this.pathReportDateWiseList.push(_param);
                          _param = new PathReportDateWiseDetail();
                        }
                      }
                    }
                  }
                } else {
                  if (_param.date) {
                    if (_param.date === this._commonService.trasformDateTimeByFormat('yyyy-MM-dd', z.RequestDate)) {
                      _param.dataArray.push(z);
                    } else {
                      if (_param.dataArray.length) {
                        this.pathReportDateWiseList.push(_param);
                        _param = new PathReportDateWiseDetail();
                      }
                    }
                  }
                }
              }
            }
          )
        }
        console.log(this.pathReportDateWiseList);
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details.')
      }
    )
  }

  pathLabRegIdList: string[] = [];
  loadPathRegId() {
    this._pathManagementServices.getPathRegIdList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          let _array = (res.dataSet.Table || []) || [];
          if (_array.length) {
            this.pathLabRegIdList = [];
            _array.forEach((z: any) => {
              if (z.Value) {
                this.pathLabRegIdList.push(z.Value);
              }
            });
            this.pathLabId = this.pathLabRegIdList[0];
          }
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);

      }
    )
  }

  loadPathReportListByPathIdAndPatientIdDate() {
    this._pathManagementServices.getPathReportListByPathIdPatientId(this.pathReportDate, this.pathLabId, this.selectedIpdDetails.EntityId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.pathReportList = [];
          this.pathReportList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  rediectToPathManagement(_parhReportDetail: any) {
    this._router.navigate(['feature/ipd/path-summary'], { queryParams: { patientId: this.selectedIpdDetails.EntityId, pathAppId: _parhReportDetail.AppointmentId, pathLabId: _parhReportDetail.pathlabid } })
  }

  setWidthBasedOnDevice() {
    if (this.validPlatform('iphone') || this.validPlatform('ipad') || this.validPlatform('android')) {
      return '100rem';
    } else {
      return '30rem';
    }
  }

  validRole_ShowDoctorSisterNotes_Btn(_role: string) {
    let _currentRole = this._commonService.getCurrentSessionUserRole() || ''
    if (_role && _currentRole && _currentRole.toLowerCase().includes(_role)) {
      return true;
    } else {
      return false;
    }
  }

  showCombinedPatientSearchDetail(_patient?: SearchedPatientDetail) {
    // history.state.patientId = this.selectedIpdDetails ? this.selectedIpdDetails.EntityId : 0;
    let ref = this._dialogService.open(CombinedPatientSearchComponent, {
      header: _patient?.EntityName.toUpperCase() + ' - Hospital History',
      width: '60vw',
      data: {
        // admissionId: this.selectedIpdDetails.AppointmentId,
        // type: 'doctor notes'
        patientId: _patient?.EntityId || 0,
        patientName: _patient?.EntityName || ''
      }
    })
    ref.onClose.subscribe(
      (res:any)=>{
        console.log("Dialoge Closed =>", res);
        if(res){
          this.fromDate = res.date;
          this.toDate = res.date;
          this.searchedPatientName = res.patientName;
          this.isCustomDate = '2';
          this.loadPatientListByCustomDate(res.patientId)
        }
      }
    )
  }

}
