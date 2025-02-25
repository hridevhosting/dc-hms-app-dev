import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdmissionService } from 'src/app/@core/services/admission.service';
import { AppointmentService } from 'src/app/@core/services/appointment.service';
import { BillManagementService } from 'src/app/@core/services/bill-management.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { PathManagementService } from 'src/app/@core/services/path-management.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { BillDetail } from 'src/app/shared/modals/bill-detail';
import { PatientDetail } from 'src/app/shared/modals/patient-detail';
import { Response } from 'src/app/shared/modals/response';
import { environment } from 'src/environments/environment';

class PathReportItemDetail {
  testName: string = '';
  isOpened: boolean = true;
  testDataArray: any[] = []
}

@Component({
    selector: 'app-path-management',
    standalone:true,
    imports: [CommonModule, FormsModule],
    templateUrl: './path-management.component.html',
    styleUrl: './path-management.component.css'
})
export class PathManagementComponent implements OnInit {

  constructor(
    private _activeRoute: ActivatedRoute,
    private _pathManagementServices: PathManagementService,
    private _patientManagementServices: PatientManagementService,
    private _billManagementService: BillManagementService,
    private _commonServices: CommonService,
    private _admissionServices: AdmissionService,
    private _appointmentServices: AppointmentService
  ) { }

  ngOnInit(): void {

    let _dep: any = window.document.location.href || '';

    if (_dep) {
      if (_dep.includes('ipd')) {
        _dep = 'IPD';
      }
      if (_dep.includes('opd')) {
        _dep = 'OPD';
      }
      environment.hospitalSection = _dep;
    }


    this._commonServices.setHospitalSection(_dep + (_dep ? ' > ' : '') + 'Path Report Summary');

    this._activeRoute.queryParams.subscribe(
      (res: any) => {
        console.log(res);
        this.patientId = Number(res.patientId);
        this.pathAppId = Number(res.pathAppId);
        this.pathLabId = res.pathLabId;
        if (this.patientId) {
          this.loadPatientDetailsByPatientId();
          this.loadBillListByPatientHospitalSection(this.patientId, this.pathAppId, 'Path');
          this.loadCaseDetail();
        }
      }
    )


  }

  patientId: number = 0;
  pathAppId: number = 0;
  pathLabId: string = '';
  patientDetails: PatientDetail = new PatientDetail();
  loadPatientDetailsByPatientId() {
    this._patientManagementServices.getPatientDetailsByPatientId(this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.patientDetails = res.dataSet.Table[0];
          this.loadPathReportItemList();
        }
      }, (err) => {
        console.error(err);
      }
    )
  }

  pathReportItemList: PathReportItemDetail[] = [];
  loadPathReportItemList() {
    let _param = {
      AppointmentId: this.pathAppId,
      PathLabId: this.pathLabId
    }
    this._pathManagementServices.getPathReportItemListByPathReportDetail(_param, this.patientDetails).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          let _data = res.dataSet.Table;
          this.sortReportItemList(_data)
          console.log(_data);
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  billDetail: BillDetail = new BillDetail();
  billList: BillDetail[] = [];
  loadBillListByPatientHospitalSection(_patientId: number, _appointmentId: number, _hospitalSection: string) {
    this._billManagementService.getBillListByPatientAndAppointmentId(_patientId, _appointmentId, _hospitalSection).subscribe(

      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.billList = res.dataSet.Table;
          this.sortCurrentBillDetailByPathAppId();
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        alert('Please check log, for more details');
      }

    )
  }


  loadCaseDetail() {
    debugger
    if (environment.hospitalSection) {
      if (environment.hospitalSection.toLowerCase() === 'ipd') {
        this.loadAdmissionDetailByAdmissionIdPatientId();
      }
      if (environment.hospitalSection.toLowerCase() === 'opd') {
        this.loadAppointmentDetailByAppointmentIdPatientId();
      }
    } else {

    }
  }

  caseDetail: any = null;
  loadAppointmentDetailByAppointmentIdPatientId() {
    this._appointmentServices.getAppointmentDetailsByAppointmentIdPatientId(this.pathAppId, this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.caseDetail = null;
          this.caseDetail = res.dataSet.Table[0];
          console.log(this.caseDetail);
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  loadAdmissionDetailByAdmissionIdPatientId() {
    debugger
    this._admissionServices.getAddmissionDetailsByAdmissionIdPatientId(this.pathAppId, this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.caseDetail = null;
          this.caseDetail = res.dataSet.Table[0];
          console.log(this.caseDetail);
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }


  sortCurrentBillDetailByPathAppId() {
    if (this.billList.length) {
      this.billList.forEach(
        (z: BillDetail) => {
          if (z.AppointmentId === this.pathAppId) {
            this.billDetail = z;
          }
        }
      )
      console.log(this.billDetail);
    }
  }

  sortReportItemList(_dataArray: any) {
    let _param: PathReportItemDetail = new PathReportItemDetail();
    this.pathReportItemList = [];
    _dataArray.forEach(
      (z: any) => {
        debugger
        let _date = z.tests || '';
        if (_date === 'Sr. Potassium') {
          debugger
        }
        if (_date) {
          if (!_param.testName) {
            _param.testName = _date;
          }

          if (!this.pathReportItemList.length) {
            if (_param.testName && !_param.testDataArray.length) {
              _param.testDataArray.push(z);
            } else {
              if (_param.testName) {
                if (_param.testName === _date) {
                  _param.testDataArray.push(z);
                } else if (_param.testName !== _date) {
                  this.pathReportItemList.push(_param);
                  _param = new PathReportItemDetail();
                  _param.testName = _date;
                  _param.testDataArray.push(z);
                } else {
                  if (_param.testDataArray.length) {
                    this.pathReportItemList.push(_param);
                    _param = new PathReportItemDetail();
                  }
                }
              }
            }
          } else {
            if (_param.testName) {
              if (_param.testName === _date) {
                _param.testDataArray.push(z);
              } else if (_param.testName !== _date) {
                this.pathReportItemList.push(_param);
                _param = new PathReportItemDetail();
                _param.testName = _date;
                _param.testDataArray.push(z);
              } else {
                if (_param.testDataArray.length) {
                  this.pathReportItemList.push(_param);
                  _param = new PathReportItemDetail();
                }
              }
            }
          }
        }
      }
    )
    this.pathReportItemList.push(_param);
    console.log(this.pathReportItemList);
  }

  changeBgColor(_isOpened: boolean) {
    if (_isOpened) {
      return '#FF8A8A'
    } else {
      return '#03AED2'
    }
  }

  isMinimizeAll: boolean = false;
  minimizeMaximizeAll() {
    this.pathReportItemList.forEach(
      (z: PathReportItemDetail) => {
        z.isOpened = this.isMinimizeAll;
      }
    )
    this.isMinimizeAll = !this.isMinimizeAll;
  }


  validPlatform(_query: string) {
    return this._commonServices.checkPlatform(_query);
  }

  replaceString(_string: string) {
    let _res = ''

    if (_string) {
      if (_string.includes('<B>')) {
        _res = _string.replaceAll('<B>', '')
      } else {
        _res = _string
      }
    }

    return _res;
  }

}
