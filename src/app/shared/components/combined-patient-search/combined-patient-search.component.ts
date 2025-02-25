import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/@core/services/common.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { PrimeNgModule } from '../../modules/prime-ng.module';
import { Patient } from '../../modals/Patient';
import { Response } from '../../modals/response';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdmissionHistoryComponent } from 'src/app/@core/components/feature/admission-history/admission-history.component';
import { Router } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayModule } from 'primeng/overlay';

class PatientHospitalHistory {
  departmentName: string = '';
  dataArray: any[] = [];
}

@Component({
  selector: 'app-combined-patient-search',
  imports: [CommonModule, FormsModule, PrimeNgModule, OverlayPanelModule, OverlayModule],
  standalone: true,
  templateUrl: './combined-patient-search.component.html',
  styleUrl: './combined-patient-search.component.css'
})
export class CombinedPatientSearchComponent implements OnInit {

  constructor(
    private _commonServices: CommonService,
    private _patientServices: PatientManagementService,
    private _dialogConfig: DynamicDialogConfig,
    public _dialogService: DialogService,
    private _router: Router,
    private dialogRef: DynamicDialogRef
  ) { }


  // ipdHistoryList: any[] = [];
  // opdHistoryList: any[] = [];
  // pathHistoryList: any[] = [];
  historyListWithDept: any[] = [];
  patientId: number = 0;
  activeIndex: number = 0;
  patientName: string = ''
  ngOnInit(): void {
    let _data = this._dialogConfig.data || null;
    // console.log(_data);
    // console.log(history.state);
    if (_data) {
      this.patientId = _data.patientId || 0;
      this.patientName = _data.patientName || 0;
    }

    if (this.patientId) {
      this.loadPatient_IPD_OPD_PATH_History()
    }
  }

  loadPatient_IPD_OPD_PATH_History() {
    if (this.patientId) {
      let _patientDetail: Patient = new Patient();
      _patientDetail.EntityId = this.patientId;
      this._patientServices.getPatient_IPD_OPD_PATH_History_Detail(_patientDetail).subscribe(
        (res: Response) => {
          console.log(res);
          debugger
          if (res.Status.toLowerCase().trim().includes('success') && res.noofREcords) {
            this.sortHistoryListWithDept(res.dataSet);
          }
        }, (err: Error) => {
          console.error(err);
        }
      )
    } else {

    }
  }

  sortHistoryListWithDept(_res: any) {
    debugger
    if (_res) {
      let _object = Object.keys(_res);
      debugger
      if (_object.length) {
        this.historyListWithDept = [];
        for (let i = 0; i < _object.length; i++) {
          let _keys = Object.keys(_res[_object[i]][0]) || 0;
          if (_keys.length) {
            if (_keys[0].trim().toLowerCase().includes('hospitalsectionname')) {
              let _z: PatientHospitalHistory = new PatientHospitalHistory();
              _z.departmentName = _res[_object[i]][0][_keys[0]];
              _z.dataArray = _res[_object[i + 1]];
              i = i + 1;
              this.historyListWithDept.push(_z);
            }
          }
        }
      }
      console.log(this.historyListWithDept);
    }
  }

  admissionId: number = 0;
  showAdmissionHistoryForIpdPatientDialoge() {
    history.state.patientId = this.patientId;
    let ref = this._dialogService.open(AdmissionHistoryComponent, {
      header: 'Admission History',
      width: 'auto',
      data: {
        admissionId: this.admissionId,
        type: 'discharge summary'
      }
    })
  }

  appointmentId: number = 0;
  navigateToOpdCard() {
    // this._router.navigateByUrl('feature/opd/opd-card', { state: { appointmentId: this.selectedIpdDetails.AppointmentId }, queryP })
    this._router.navigate(['feature/opd/opd-card'], { state: { appointmentId: this.appointmentId, hospitalSection: 'OPD' }, queryParams: { appointmentId: this.appointmentId } })
    // this._router.navigate(['feature/opd/opd-card'], { state: { appointmentId: this.selectedIpdDetails.AppointmentId } })
  }

  // dialogRef = DynamicDialogRef
  searchPatient_IPD_Screen(_ipdDetail: any) {
    let _param = {
      patientId: _ipdDetail.PatientId || 0,
      date: (_ipdDetail.TAdmissionDate ? _ipdDetail.TAdmissionDate.split('T')[0] : '') || '',
      patientName:  this.patientName || ''
    }
    this.dialogRef.close(_param);
    this._dialogService.dialogComponentRefMap.forEach(dialog => {
      dialog.destroy();
    });
  }

}
