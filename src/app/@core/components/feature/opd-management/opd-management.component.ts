import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/@core/services/common.service';
import { IpdManagementService } from 'src/app/@core/services/ipd-management.service';
import { environment } from 'src/environments/environment';
import { AdmissionHistoryComponent } from '../admission-history/admission-history.component';
import { BedAllocationManagementComponent } from '../bed-allocation-management/bed-allocation-management.component';
import { BillingListComponent } from '../billing-list/billing-list.component';
import { Response } from 'src/app/shared/modals/response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { OpdPatientList } from 'src/app/shared/modals/opd-patient-list';
import { AttributeSetComponent } from '../attribute-set/attribute-set.component';
import { OpdManagementService } from 'src/app/@core/services/opd-management.service';
import { PendingDoneStatusDirective } from 'src/app/shared/others/pending-done-status.directive';
import { PatientAppointmentComponent } from '../patient-appointment/patient-appointment.component';
import { PatientDetailsComponent } from '../patient-details/patient-details.component';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/@core/services/appointment.service';
import { count } from 'rxjs';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { PathManagementService } from 'src/app/@core/services/path-management.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  selector: 'app-opd-management',
  imports: [CommonModule, FormsModule, PrimeNgModule, PendingDoneStatusDirective, PatientDetailsComponent, PatientDetailsComponent, PatientAppointmentComponent],
  providers: [DialogService, DynamicDialogConfig],
  templateUrl: './opd-management.component.html',
  styleUrl: './opd-management.component.css'
})
export class OpdManagementComponent {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;
  showAlertPopup: any;

  constructor(
    private _opdServices: OpdManagementService,
    public _dialogService: DialogService,
    private _commonService: CommonService,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _appointmentServices: AppointmentService,
    private _patientServices: PatientManagementService,
    private _pathManagementServices: PathManagementService
  ) { }

  items: MenuItem[] = [];
  visibleFilterDialog: boolean = false;
  visibleAdditionalOptionsDialog: boolean = false;
  isCustomDate: string = 'false';
  activeIndex: number = 0;
  tabs: { title: string, content: string }[] = [];
  ngOnInit() {
    this._commonService.setHospitalSection('OPD Management');
    this.tabs = [
      { title: 'Tab 1', content: 'Tab 1 Content' },
      { title: 'Tab 2', content: 'Tab 2 Content' },
      { title: 'Tab 3', content: 'Tab 3 Content' }
    ];
    environment.hospitalSection = 'opd';
    history.state.hospitalSection = 'opd';
    ////debugger
    let _currentSystemDate: any = new Date();
    _currentSystemDate = this._commonService.trasformDateTimeByFormat()?.split('T')[0];
    if (!this.fromDate && !this.toDate) {
      this.fromDate = _currentSystemDate;
      this.toDate = _currentSystemDate;
    }
    this.loadAppointmentPatientList();
    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video'
              }
            ]
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          }
        ]
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
      }
    ];

    // this.filterType.push('Floor');
    // this.filterType.push('Room Type');
    this.filterType.push('Procedure');
    this.filterType.push('Consultant');

    // this.filterTypeList.push('Admitted');
    // this.patientType.push('Discharge');

    this.screenHeight = environment.screenHeight;
    this.screenWidth = environment.screenWidth;

  }

  opdAppointmentPatientList: OpdPatientList[] = [];
  opdPatientListConsultantList: string[] = [];
  opdPatientListReferredConsultantList: string[] = [];
  opdPatientListAppointmentReasonList: string[] = [];
  screenHeight: number = 0;
  screenWidth: number = 0;
  moreDetails: boolean = false;
  showAppointmentListModal: boolean = false;
  selectedIpdDetails: any = null;
  filterType: string[] = [];
  filterTypeList: string[] = [];
  fromDate: string = '';
  toDate: string = '';
  stateOptions: any[] = [{ label: 'All', value: 'all' }, { label: 'Consultant wise', value: 'user-wise' }];
  value: string = 'user-wise';
  listViewOption: any[] = [{ label: 'Table', value: 'table' }, { label: 'Card', value: 'card' }];
  statusValue: string = 'waiting';
  listViewValue: string = 'table';
  selectedFilterType: string = '';
  selectedSubFilterValue: string = '';

  loadAppointmentPatientList(isFilter?: boolean) {
    //debugger
    this.isRefreshing = true;
    // this._commonService.activeLoader()
    this._opdServices.getAppointmentPaitentListForOPD(this.fromDate, this.toDate).subscribe(
      (res: Response) => {
        //debugger
        this.isFilterPatient = isFilter || false;
        console.log(res);
        setTimeout(() => {
          if (!this.isFilterPatient) {
            this.loadAppointmentPatientList();
          }
        }, 5000);
        // this._commonService.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.opdAppointmentPatientList = [];
          this.opdAppointmentPatientList = res.dataSet.Table;
          if (this.opdAppointmentPatientList.length) {

            this.sortPatientByConsultant();
            this.sortOpdPatientAppointmentReasonList();
            this.sortOpdPatientConsultantList();
            // this.sortOpdPatientReferredConsultantList();
          }
          console.log(this.opdAppointmentPatientList);
        }
        setTimeout(() => {
          this.isRefreshing = false;
        }, 1000)

      }, (err: Error) => {
        //debugger
        console.error(err);
        this.isFilterPatient = isFilter || false;
        setTimeout(() => {
          this.isRefreshing = false;
        }, 1000)
        // this._commonService.deactiveLoader();
      }
    )




  }

  searchPatientListWithFilterSettings() {
    //debugger
    this.loadAppointmentPatientList(true);
  }

  sortOpdPatientAppointmentReasonList() {
    this.opdPatientListAppointmentReasonList = [];
    this.opdAppointmentPatientList.forEach(
      (z: OpdPatientList) => {
        if (z.Treatment) {
          if (this.opdPatientListAppointmentReasonList.length) {
            let _isAvailable: boolean = false;
            this.opdPatientListAppointmentReasonList.forEach(
              (y: string) => {
                if (y.toLowerCase() === z.BookedFor.toLowerCase()) {
                  _isAvailable = true;
                }
              }
            )
            if (!_isAvailable) {
              this.opdPatientListAppointmentReasonList.push(z.Treatment);
            }
          } else {
            this.opdPatientListAppointmentReasonList.push(z.Treatment);
          }
        } else {
          this.opdPatientListAppointmentReasonList.push(z.Treatment1);
        }
      }
    )
    console.log(this.opdPatientListAppointmentReasonList);
  }

  sortOpdPatientReferredConsultantList() {
    this.opdPatientListReferredConsultantList = [];
    this.opdAppointmentPatientList.forEach(
      (z: OpdPatientList) => {
        if (z.ReferredBy) {
          if (this.opdPatientListReferredConsultantList.length) {
            let _isAvailable: boolean = false;
            this.opdPatientListReferredConsultantList.forEach(
              (y: string) => {
                if (y.toLowerCase() === z.BookedFor.toLowerCase()) {
                  _isAvailable = true;
                }
              }
            )
            if (!_isAvailable) {
              this.opdPatientListReferredConsultantList.push(z.ReferredBy);
            }
          } else {
            this.opdPatientListReferredConsultantList.push(z.ReferredBy);
          }
        }
      }
    )
    console.log(this.opdPatientListReferredConsultantList);
  }

  sortOpdPatientConsultantList() {
    this.opdPatientListConsultantList = [];
    this.opdAppointmentPatientList.forEach(
      (z: OpdPatientList) => {
        if (z.BookedFor) {
          if (this.opdPatientListConsultantList.length) {
            let _isAvailable: boolean = false;
            this.opdPatientListConsultantList.forEach(
              (y: string) => {
                if (y.toLowerCase() === z.BookedFor.toLowerCase()) {
                  _isAvailable = true;
                }
              }
            )
            if (!_isAvailable) {
              this.opdPatientListConsultantList.push(z.BookedFor)
            }
          } else {
            this.opdPatientListConsultantList.push(z.BookedFor)
          }
        }
      }
    )
    this.filterPatientByFilterTypeFilterSubType();
    console.log(this.opdPatientListConsultantList);
  }


  setDetailsOfOpdPatient(patientDetails: any) {
    this.selectedIpdDetails = null;
    this.selectedIpdDetails = patientDetails;
    console.log(this.selectedIpdDetails);
  }

  showBedAllocationDialoge() {
    let ref = this._dialogService.open(BedAllocationManagementComponent, {
      header: 'Bed Allocation'
    })
  }

  showAttributeSetDialoge() {
    let ref = this._dialogService.open(AttributeSetComponent, {
      header: 'Attribute Set',
      width: 'auto',
      data: {
        admissionId: this.selectedIpdDetails.AppointmentId,
      }
    })
  }

  showPatientAppointmentDialoge() {
    let ref = this._dialogService.open(PatientAppointmentComponent, {
      header: 'Patient Details - '
        + this.selectedIpdDetails.PatientName.toUpperCase()
      ,
      width: '50%',
      data: {
        patientId: this.selectedIpdDetails.EntityId,
        appointmentId: this.selectedIpdDetails.AppointmentId
      }
    })
  }

  showPatientDetailsDialoge() {
    console.log(this.selectedIpdDetails);
    let ref = this._dialogService.open(PatientDetailsComponent, {
      header: 'Patient Details - '
        + this.selectedIpdDetails.PatientName.toUpperCase()
      ,
      width: '50%',
      data: {
        patientId: this.selectedIpdDetails.EntityId,
      }
    })
  }

  showBillDialoge() {
    ////debugger
    let ref = this._dialogService.open(BillingListComponent, {
      header: 'Bill List - ' + this.selectedIpdDetails.PatientName.toUpperCase(),
      width: 'auto',
      data: {
        ipdPatientDetail: this.selectedIpdDetails,
        billType: 'opd'
      }
    })
  }

  showPathBillDialoge() {
    let ref = this._dialogService.open(BillingListComponent, {
      header: 'Path Bill List - ' + this.selectedIpdDetails.PatientName.toUpperCase(),
      width: 'auto',
      data: {
        ipdPatientDetail: this.selectedIpdDetails,
        billType: 'path'
      }
    })
  }

  sortedPatientListByConsultant: any[] = [];
  sortPatientByConsultant() {
    ////debugger
    let _userName = this._commonService.getCurrentSessionUserNameByUserRole('doctor') || null;
    if (_userName || this.selectedFilterType) {
      let _filtered: OpdPatientList[] = [];

      this.opdAppointmentPatientList.forEach(
        (z: OpdPatientList) => {
          ////debugger
          if (_userName && this.value.toLowerCase().includes('user')) {
            if (z.BookedFor.toLowerCase().includes(_userName.toLowerCase())) {
              _filtered.push(z);
            }
          } else {
            _filtered.push(z);
          }
          // else if (this.selectedFilterType && this.selectedSubFilterType) {
          //   if (this.selectedFilterType.toLowerCase().includes('consultant') && z.BookedFor.toLowerCase().includes(this.selectedSubFilterType.toLowerCase())) {
          //     _filtered.push(z);
          //   }
          //   if (this.selectedFilterType.toLowerCase().includes('procedure') && z.Treatment.toLowerCase().includes(this.selectedSubFilterType.toLowerCase())) {
          //     _filtered.push(z);
          //   }
          // }
        }
      )
      ////debugger
      this.sortedPatientListByConsultant = _filtered;
      this.filterPatientListByWatingLeft();
    } else {

    }
  }



  filteredPatientList: OpdPatientList[] = [];
  filteredWatingPatientList: OpdPatientList[] = [];
  filteredLeftPatientList: OpdPatientList[] = [];

  filterPatientListByWatingLeft(isReset?: boolean) {
    let _filtered: OpdPatientList[] = [];
    ////debugger

    this.filteredLeftPatientList = [];
    this.filteredWatingPatientList = [];

    this.sortedPatientListByConsultant.forEach(
      (z: OpdPatientList) => {
        ////debugger
        if (this.statusValue.toLowerCase().includes('waiting') && z.Arrived && !z.LeftHosp) {
          this.filteredWatingPatientList.push(z);
        }
        if (this.statusValue.toLowerCase().includes('left') && z.Arrived && z.LeftHosp) {
          this.filteredLeftPatientList.push(z);
        }
      }
    )

    ////debugger
    // this.filteredPatientList = _filtered;
    this.filterPatientByFilterTypeFilterSubType()
    if (isReset) {
      // this.resetFilter();
    }
  }

  selectedSubFilterType: string = '';
  searchPatienName: string = '';
  isFilterPatient: boolean = false;
  filterPatientByFilterTypeFilterSubType(_isSearch?: boolean) {
    debugger
    let _filtered: OpdPatientList[] = [];


    if (!this.searchPatienName.length && !this.isFilterPatient) {
      this.isFilterPatient = false
    }

    // if(!this.isFilterPatient ){

    // }
    // this.isFilterPatient = this.isFilterPatient ? this.isFilterPatient : _isSearch;

    if (!this.selectedFilterType && !this.selectedSubFilterValue && !this.isFilterPatient) {
      _filtered = _filtered.length === 0 ? this.sortedPatientListByConsultant : _filtered;
    }

    if ((this.selectedFilterType && this.selectedSubFilterValue || this.isFilterPatient) && this.opdAppointmentPatientList.length) {
      debugger
      this.opdAppointmentPatientList.forEach(
        (z: any) => {
          if (z) {
            debugger
            let _val = this.searchPatienName ? 'PatientName' : this.selectedFilterType;
            let _val1 = (this.searchPatienName ? this.searchPatienName : this.selectedSubFilterValue).trim().toLowerCase();
            if (z[_val] !== undefined) {
              let _val2 = z[_val].toLowerCase().trim();
              if (_val && _val2) {
                if (_val2.includes(_val1)) {
                  _filtered.push(z)
                }
              }
            }
          }
        }
      )

    } else {
      _filtered = this.opdAppointmentPatientList;
    }

    let _consulatantWiseFiltered: OpdPatientList[] = [];
    debugger
    if (this.value.includes('user-wise')) {
      let _userName = this._commonService.getCurrentSessionUserNameByUserRole('doctor');
      _filtered.forEach(
        (z: OpdPatientList) => {
          debugger
          if (_userName) {
            if (z.BookedFor.replaceAll('.', '').toLowerCase().includes(_userName.replaceAll('.', '').toLowerCase())) {
              _consulatantWiseFiltered.push(z);
            }
          }
        }
      )
      if (_consulatantWiseFiltered.length) {
        _filtered = _consulatantWiseFiltered;
      } else {
        this.value = 'all';
      }
    }

    this.filteredPatientList = _filtered;

    if (!this.filteredPatientList.length && this.isFilterPatient && this.searchPatienName.length) {
      this.showAlertPopup = true;
    }

    console.log(this.filteredPatientList);

  }

  tableIndex = 0
  updateIndex() {
    return this.tableIndex = this.tableIndex + 1
  }

  navigateToOpdCard() {
    // this._router.navigateByUrl('feature/opd/opd-card', { state: { appointmentId: this.selectedIpdDetails.AppointmentId }, queryP })
    this._router.navigate(['feature/opd/opd-card'], { state: { appointmentId: this.selectedIpdDetails.AppointmentId, hospitalSection: environment.hospitalSection }, queryParams: { appointmentId: this.selectedIpdDetails.AppointmentId } })
    // this._router.navigate(['feature/opd/opd-card'], { state: { appointmentId: this.selectedIpdDetails.AppointmentId } })
  }


  validPlatform(_query: string) {
    return this._commonService.checkPlatform(_query);
  }


  previousAppointmentList: any[] = [];
  loadPreviousAppointmentListByPatientId() {
    if (this.selectedIpdDetails) {
      this._appointmentServices.getPreviousAppointmentListByPatientId(this.selectedIpdDetails.EntityId).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            this.previousAppointmentList = [];
            this.previousAppointmentList = res.dataSet.Table;
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more details.')
        }
      )
    } else {
      alert('Patient id didn`t fetched.')
    }
  }

  moreDetailHeader: string = '';
  showMoreDetails(patientDetails: any) {
    this.showAppointmentListModal = !this.showAppointmentListModal;
    this.selectedIpdDetails = patientDetails;
    console.log(this.selectedIpdDetails);
    this.loadPreviousAppointmentListByPatientId();
  }

  countWaitingDonePatient(_status: string) {
    let _count: number = 0;
    if (_status) {
      this.filteredPatientList.forEach(
        (z: OpdPatientList) => {
          if (_status.toLowerCase() === 'waiting') {
            if (!z.LeftHosp) {
              _count = _count + 1;
            }
          }
          if (_status.toLowerCase() === 'done') {
            if (z.LeftHosp) {
              _count = _count + 1;
            }
          }
        }
      )
      return _count;
    } else {
      return _count;
    }
  }

  isRefreshing: boolean = false;

  refreshing() {
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false
    }, 5000);
  }

  patientDetails: any = null;
  loadPatientDetailByPatientId() {
    this._patientServices.getPatientDetailsByPatientId(this.selectedIpdDetails.EntityId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.patientDetails = res.dataSet.Table[0]
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  leftPatientPopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'is opd done for this patient?',
      accept: () => {
        this.leftPatientByPatientIdAppointmentId(this.selectedIpdDetails.AppointmentId, this.selectedIpdDetails.EntityId, 1);
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  leftPatientByPatientIdAppointmentId(_appointmentId: number, _patientId: number, isLeft: number) {
    this._opdServices.leftPatient(_appointmentId, _patientId, isLeft).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success')) {
          this.loadAppointmentPatientList();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.');
      }
    )
  }

  setFilterListByFilterType(_filterType: string) {
    if (_filterType.toLowerCase().includes('consultant')) {
      this.filterTypeList = this.opdPatientListConsultantList;
    }
    if (_filterType.toLowerCase().includes('procedure')) {
      this.filterTypeList = this.opdPatientListAppointmentReasonList;
    }
    if (!_filterType) {
      this.filterTypeList = [];
    }
  }

  resetFilter() {
    ////debugger
    this.selectedFilterType = '';
    this.selectedSubFilterValue = '';
    this.isFilterPatient = false;
    this.searchPatienName = '';
    this.sortPatientByConsultant();
  }

  showPathReportListDateWise: boolean = false;
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


  setWidthBasedOnDevice() {
    if (this.validPlatform('iphone') || this.validPlatform('ipad') || this.validPlatform('android')) {
      return '100rem';
    } else {
      return '30rem';
    }
  }

  rediectToPathManagement(_parhReportDetail: any) {
    this._router.navigate(['feature/opd/path-summary'], { queryParams: { patientId: this.selectedIpdDetails.EntityId, pathAppId: _parhReportDetail.AppointmentId, pathLabId: _parhReportDetail.pathlabid } })
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

  printBlankOpdCard() {
    let _htmlContent: string = '';
    console.log(this.selectedIpdDetails);
    this.loadPatientDetailByPatientId();
    debugger
    this._opdServices.getBlankOpdCardData().subscribe(
      (res: any) => {
        console.log(res);
        debugger
      }, (err: HttpErrorResponse) => {
        debugger
        console.error(err);
        if (err.status === 200 && err.statusText.toLowerCase() === 'ok') {
          _htmlContent = err.error.text;
          console.log(_htmlContent);
          if (_htmlContent) {
            this.openBlankOpdCard(_htmlContent);
          } else {
            alert('Pleasr try again or template is not available.');
          }
        }
      }
    )
  }

  openBlankOpdCard(_htmlData: string) {

    _htmlData = _htmlData.replaceAll('#OPDNO#', this.selectedIpdDetails.OPDNo)
    _htmlData = _htmlData.replaceAll('#PNAME#', this.patientDetails.EntityName)
    _htmlData = _htmlData.replaceAll('#AGE#', this.patientDetails.PrimaryId1)
    _htmlData = _htmlData.replaceAll('#SEX#', this.patientDetails.PrimaryFld2)
    _htmlData = _htmlData.replaceAll('#MOBILENO#', this.patientDetails.PrimaryFld1)
    _htmlData = _htmlData.replaceAll('#DOCTORNAME#', this.selectedIpdDetails.BookedFor)
    _htmlData = _htmlData.replaceAll('#APPDATE#', this._commonService.trasformDateTimeByFormat('dd/MMM/yyyy', this.selectedIpdDetails.StartDateTime) || '');
    _htmlData = _htmlData.replaceAll('#ADDRESS#', this.patientDetails.PrimaryFld4);

    debugger
    this._commonService.printHtmlInNewWindow(_htmlData);

  }


  searchedPatientList: SearchedPatientDetail[] = [];
  loadPatientList(_searchQuery: string) {
    if (_searchQuery || this.searchPatienName) {
      this._patientServices.getPatientDetailsByPatientPatientName_IPD_Dashboard(_searchQuery || this.searchPatienName).subscribe(
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

  setAndSearchPatientDetailByPatientName(_patientName: string) {
    this.searchPatienName = _patientName.toUpperCase();
    // this.sortSelectedFilterTypeArrayDataByFilterType();
    this.filterPatientByFilterTypeFilterSubType(true);
    this.searchedPatientList = [];
  }

}


