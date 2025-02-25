import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AdmissionService } from 'src/app/@core/services/admission.service';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { AttributeSetComponent } from '../attribute-set/attribute-set.component';
import { DischargeSummaryComponent } from '../discharge-summary/discharge-summary.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admission-history',
  imports: [CommonModule, FormsModule, PrimeNgModule],
  providers: [PrimeNgModule],
  templateUrl: './admission-history.component.html',
  styleUrl: './admission-history.component.css'
})
export class AdmissionHistoryComponent implements OnInit {
  height: any;

  constructor(
    private _admissionServices: AdmissionService,
    private _dialogConfig: DynamicDialogConfig,
    private _dialogService: DialogService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    debugger
    let _data = this._dialogConfig.data || null;
    // console.log(_data);
    // console.log(history.state);
    if (_data) {
      this.admissionId = _data.admissionId;
      this.isNote = '';
      if (_data['type'] && _data['type'] != undefined) {
        this.isNote = _data['type']
      }
      if (this.isNote.toLowerCase().trim().includes('note')) {
        this.loadNotesListByAdmissionIdNoteType()
      } else {
        this.loadAdmissionListByAdmissionId();
      }
    }
  }

  admissionList: any[] = [];
  admissionId: number = 0;
  isNote: string = ''
  loadAdmissionListByAdmissionId() {
    this._admissionServices.getAddmissionHistoryByPatientAdmissionId(this.admissionId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.admissionList = [];
          this.admissionList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  loadNotesListByAdmissionIdNoteType() {
    this._admissionServices.getNoteHistoryByPatientAdmissionIdNoteType(this.admissionId, this.isNote).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.admissionList = [];
          this.admissionList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  loadLastAppointmentId() {
    this._admissionServices.getLastAppointmentId().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          let _id = res.dataSet.Table[0].AppointmentId || 0;
          if (_id > 0) {
            _id = _id + 1;
            this.addNewNote(_id)
          }
        }
      }, (err: Error) => {
        console.error(err);
        alert('Plese check logs.')
      }
    )
  }

  addNewNote(_id: number) {
    this._router.navigate(['feature/ipd/discharge-summary'], { state: { procId: _id || 0, patientId: history.state.patientId || 0, admissionId: this.admissionId || 0, hospitalSection: environment.hospitalSection, noteType: this.isNote }, queryParams: { procId: _id || 0, patientId: history.state.patientId || 0, admissionId: this.admissionId || 0, noteType: this.isNote } })
    this._dialogService.dialogComponentRefMap.forEach(dialog => {
      dialog.destroy();
    });
  }

  showAttributeListDialog(procDetails: any) {
    // let _ref = this._dialogService.open(AttributeSetComponent,{
    //   header:'Attribute Set'
    // })
    //debugger

    console.log(procDetails);
    debugger
    if (procDetails.AdmissionProcId || this.isNote.toLowerCase().trim().includes('note')) {
      let _procId = !this.isNote.toLowerCase().trim().includes('note') ? procDetails.AdmissionProcId : this.admissionId || 0;
      this._router.navigate(['feature/ipd/discharge-summary'], { state: { procId: _procId, patientId: history.state.patientId || 0, admissionId: this.admissionId || 0, hospitalSection: environment.hospitalSection, noteType: this.isNote }, queryParams: { procId: _procId, patientId: history.state.patientId || 0, admissionId: this.admissionId || 0, noteType: this.isNote } })
      this._dialogService.dialogComponentRefMap.forEach(dialog => {
        dialog.destroy();
      });
    } else {
      alert('Please provide proper Proc Id, ' + procDetails.AdmissionProcId)
    }

  }

  loadDischargeSummarySet() {

  }

  notesList: any[] = [];
  showNotesListModal: boolean = false;
  loadNotesListByNoteTypeAppointmentId(_date: string) {
    this._admissionServices.getNotesList(this.isNote, this.admissionId, _date, _date).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          console.log(res);
          this.notesList = [];
          this.notesList = res.dataSet.Table || [];
          this.notesList.forEach(
            (z: any) => {
              debugger
              if (z.data.includes('save= Click to Save')) {
                z.data = z.data.replaceAll('save= Click to Save', '');
              }
            }
          )
          this.showNotesListModal = true;
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

}
