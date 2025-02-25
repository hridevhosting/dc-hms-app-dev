import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AppointmentService } from 'src/app/@core/services/appointment.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { List } from 'src/app/shared/modals/list';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-patient-appointment',
    imports: [CommonModule, PrimeNgModule, FormsModule],
    templateUrl: './patient-appointment.component.html',
    styleUrl: './patient-appointment.component.css'
})
export class PatientAppointmentComponent implements OnInit, OnChanges {

  constructor(
    private _commonService: CommonService,
    private _dialogeConfig: DynamicDialogConfig,
    private _patientServices: PatientManagementService,
    private _appointmentServices: AppointmentService
  ) { }

  ngOnInit(): void {
    let _data = this._dialogeConfig.data || null;
    if (_data) {
      console.log(_data);
      this.patientId = _data.patientId || 0;
      this.appointmentId = _data.appointmentId || 0;
      this.loadPatientDetailsByPatientId()
      this.loadAppointmentDetailByAppointmentIdPatientId();
    }
    this.loadAppointmentReasonConsultantDoctorReferralDoctorDepartmentList();
    this.loadMaritalStatusList();
    this.loadPatientCategoryList();
    this.loadPayerList();
    this.loadTpaList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId'] && changes['appointmentId']) {
      this.loadPatientDetailsByPatientId()
      this.loadAppointmentDetailByAppointmentIdPatientId();
    }
  }

  maritalStatusList: List[] = [];
  @Input() patientId: number = 0;
  @Input() appointmentId: number = 0;
  loadMaritalStatusList() {
    this._commonService.getMaritalStatusList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.maritalStatusList = [];
          this.maritalStatusList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details')
      }
    )
  }

  payerList: List[] = []
  loadPayerList() {
    this._commonService.getPayerList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.payerList = [];
          this.payerList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details')
      }
    )
  }

  tpaList: List[] = []
  loadTpaList() {
    this._commonService.getTpaList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.tpaList = [];
          this.tpaList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details')
      }
    )
  }

  patientCategoryList: List[] = []
  loadPatientCategoryList() {
    this._commonService.getPatientCategoryList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.patientCategoryList = [];
          this.patientCategoryList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details')
      }
    )
  }

  listType: string = '';
  listDetail: List = new List('');
  isNewListDetail: boolean = false;
  saveListDetail() {

    if (this.listType && this.listDetail.ListItem) {
      this.listDetail.ListType = this.listType || ''
      this.listDetail.CreatedBy = this._commonService.getCurrentSessionUserId() || 0;
      // this.listDetail.CreatedAt = this._commonService.trasformDateTimeByFormat() || '';

      this._commonService.saveListByListType(this.listDetail).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.Data) {
            alert('Successfully Done.')
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for  more details.')
        }
      )
    } else {
      alert('Please try again!');
    }

  }

  patientDetails: any = null;
  birthdate = {
    day: '',
    month: '',
    year: ''
  }
  loadPatientDetailsByPatientId() {
    this._patientServices.getPatientDetailsByPatientId(this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.patientDetails = res.dataSet.Table[0];
          this.birthdate.day = this.patientDetails.PrimaryFld3.split(' ')[0];
          this.birthdate.month = this.patientDetails.PrimaryFld3.split(' ')[1];
          this.birthdate.year = this.patientDetails.PrimaryFld3.split(' ')[2];
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }



  doctorList: string[] = [];
  appointmentReasonList: string[] = [];
  referralDoctorList: string[] = [];
  departmentList: string[] = [];
  loadAppointmentReasonConsultantDoctorReferralDoctorDepartmentList() {
    this._appointmentServices.getAppointmentReasonConsultantDoctorReferralDoctorDepartmentList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.appointmentReasonList = [];
          this.doctorList = [];
          this.referralDoctorList = [];
          this.departmentList = [];
          //debugger
          let resDataSetObjectKeys = Object.keys(res.dataSet);
          if (resDataSetObjectKeys.length) {
            resDataSetObjectKeys.map(
              (z: string) => {
                //debugger
                if (res.dataSet[z]) {
                  res.dataSet[z].map(
                    (y: any) => {
                      //debugger
                      let _objectKeys = Object.keys(y);

                      _objectKeys.forEach((objkey: string) => {
                        //debugger
                        if (objkey.toLowerCase().includes('listtype')) {

                          if (y.listtype.toLowerCase() === 'appointment reason') {
                            this.appointmentReasonList.push(y.listItem);
                          } else if (y.listtype.toLowerCase() === 'referraldoctor') {
                            this.referralDoctorList.push(y.listItem);
                          } else if (y.listtype.toLowerCase() === 'department') {
                            this.departmentList.push(y.listItem);
                          } else {

                          }

                        }

                        if (objkey.toLowerCase().includes('column1')) {

                          if (y.Column1.toLowerCase() === 'consultant doctor') {
                            this.doctorList.push(y.UserName);
                          }

                        }
                      })

                    }
                  )
                }
              }
            )
            console.log(this.appointmentReasonList);
            console.log(this.doctorList);
            console.log(this.referralDoctorList);
            console.log(this.departmentList);
          }
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details.')
      }
    )

  }

  appointmentDetail: any = null;
  loadAppointmentDetailByAppointmentIdPatientId() {
    this._appointmentServices.getAppointmentDetailsByAppointmentIdPatientId(this.appointmentId, this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.appointmentDetail = null;
          this.appointmentDetail = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details.')
      }
    )
  }

}
