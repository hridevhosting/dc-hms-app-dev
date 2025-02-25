import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AdmissionService } from 'src/app/@core/services/admission.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-patient-admission',
    imports: [PrimeNgModule, CommonModule, FormsModule],
    templateUrl: './patient-admission.component.html',
    styleUrl: './patient-admission.component.css'
})
export class PatientAdmissionComponent implements OnInit, OnChanges {
  @Input() patientId: number = 0;
  @Input() appointmentId: number = 0;

  constructor(
    private _admissionService: AdmissionService,
    private _dialogeConfig: DynamicDialogConfig,
    private _patientService: PatientManagementService
  ) { }

  admissionDetails: any = null;

  ngOnInit(): void {
    let _data = this._dialogeConfig.data || null;
    console.log(_data);

    if (_data) {
      this.loadAddmissionDetailsByAdmissionId(_data.admissionId, _data.patientId);
      this.loadPatientDetailsByPatientId(_data.patientId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId'] && changes['appointmentId']) {
      this.loadPatientDetailsByPatientId(this.patientId)
      this.loadAddmissionDetailsByAdmissionId(this.appointmentId, this.patientId);
    }
  }

  loadAddmissionDetailsByAdmissionId(admissionId: number, patientId: number) {
    this._admissionService.getAddmissionDetailsByAdmissionIdPatientId(admissionId, patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.admissionDetails = null;
          this.admissionDetails = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  patientDetails: any = null;
  loadPatientDetailsByPatientId(patientId: number) {
    this._patientService.getPatientDetailsByPatientId(patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.patientDetails = null;
          this.patientDetails = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }


}
