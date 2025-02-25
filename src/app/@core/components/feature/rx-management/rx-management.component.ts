import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/@core/services/common.service';
import { RxManagementService } from 'src/app/@core/services/rx-management.service';
import { List } from 'src/app/shared/modals/list';
import { Response } from 'src/app/shared/modals/response';
import { RxPrescription } from 'src/app/shared/modals/rx-prescription';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

class MedicinePrescription {
  medicineName: string = '';
  medicineQty: number = 0;
  medicineDays: number = 0;
  medicineType: string = '';
  medicineDoses: string = '';
  medicineDoseInstruction: string = '';
  medicineExtraInstruction: string = '';
}

@Component({
  selector: 'app-rx-management',
  imports: [CommonModule, PrimeNgModule, FormsModule],
  templateUrl: './rx-management.component.html',
  styleUrl: './rx-management.component.css',
  standalone: true
})
export class RxManagementComponent implements OnInit {

  constructor(
    private _dialogConfig: DynamicDialogConfig,
    private _rxServices: RxManagementService,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    //debugger
    this.translate()
    this.dosesList = this.englishDoseTranslate;
    let _data = this._dialogConfig.data || null;
    if (_data) {
      this.appointmentId = _data.appointmentId;
      this.loadRxListByAppointmentProcId();
    }
    this.setList();
    this.loadtMedicineDoseTranslateLang();
    setTimeout(() => {
      if (this.medicineDoseLang.ListItemId > 0) {
        this.updateDoseDataBySelectedLang(this.medicineDoseLang.ListItem);
      }
    }, 1000);
    console.log(_data);
    this.medicineDoseLang.ListItem = 'lan-hi'
  }



  appointmentId: number = 0;
  showMedicineAddUpdatePopUp: boolean = false;
  rxPrescriptionList: RxPrescription[] = [];
  showAddMedicineModal: boolean = false;
  newMedicineDetail: MedicinePrescription = new MedicinePrescription();
  medicineDoseLang: List = new List('RX_MED_DOSE_TRAN_LANG');

  loadRxListByAppointmentProcId() {
    this._rxServices.getRxListbyAppointmentId(this.appointmentId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('succes') && res.noofREcords) {
          this.rxPrescriptionList = [];
          this.rxPrescriptionList = res.dataSet.Table;
        }
        console.log(this.rxPrescriptionList);
      }, (err: Error) => {
        console.error(err)
      }
    )
  }


  medicineItemList: any[] = [];
  selectedMedcineDetails: any = null;

  dosesList: any = []

  englishDoseTranslate = [
    { doseNo: '100', doseDescription: 'Only Morning' },
    { doseNo: '010', doseDescription: 'Only Afternoon' },
    { doseNo: '001', doseDescription: 'Only Night' },
    { doseNo: '101', doseDescription: 'Morning & Night' },
    { doseNo: '110', doseDescription: 'Morning & Afternoon' },
    { doseNo: '011', doseDescription: 'Afternoon & Night' },
    { doseNo: '111', doseDescription: 'Morning, Afternoon & Night' }
  ]

  marathiDoseTranslate = [
    { doseNo: '100', doseDescription: 'फक्त सकाळी' },
    { doseNo: '010', doseDescription: 'फक्त दुपारी' },
    { doseNo: '001', doseDescription: 'फक्त रात्री' },
    { doseNo: '101', doseDescription: 'सकाळी & रात्री' },
    { doseNo: '110', doseDescription: 'सकाळी & दुपारी' },
    { doseNo: '011', doseDescription: 'दुपारी & रात्री' },
    { doseNo: '111', doseDescription: 'सकाळी, दुपारी & रात्री' }
  ]

  hindiDoseTranslate = [
    { doseNo: '100', doseDescription: 'केवल सुबह' },
    { doseNo: '010', doseDescription: 'केवल दोपहर' },
    { doseNo: '001', doseDescription: 'केवल रात' },
    { doseNo: '101', doseDescription: 'सुबह & रात' },
    { doseNo: '110', doseDescription: 'सुबह & दोपहर' },
    { doseNo: '011', doseDescription: 'दोपहर & रात' },
    { doseNo: '111', doseDescription: 'सुबह, दोपहर & रात' }
  ]

  loadMedicineItemList(_searchQuery?: string) {
    if (_searchQuery) {
      if (_searchQuery.length > 1) {
        this._rxServices.getMedicineList(_searchQuery).subscribe(
          (res: Response) => {
            if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
              this.medicineItemList = [];
              this.medicineItemList = res.dataSet.Table;
            }
          }, (err: Error) => {
            console.error(err);
          }
        )
      }
    }
  }

  updateAttributeValue(_attributeValue: string, _entityAttributeId: number, _attributeId: number, _setName: string) {
    this._rxServices.saveAttributeValueByEntityAtrributeIdAttributeIdSetName(_attributeValue, _entityAttributeId, _attributeId, _setName).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {

        }
        if (res.Status.toLowerCase().includes('failed')) {
          this.loadRxListByAppointmentProcId();
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  calculateMedicineQty() {
    let medDoseCount: number = 0;
    if (this.newMedicineDetail.medicineDoses.length) {
      for (let i = 0; i < this.newMedicineDetail.medicineDoses.length; i++) {
        if (Number(this.newMedicineDetail.medicineDoses[i])) {
          medDoseCount = medDoseCount + 1;
        }
      }
    }

    this.newMedicineDetail.medicineQty = this.newMedicineDetail.medicineDays * medDoseCount;
  }

  saveMedicine() {
    //debugger
    this.setMedicineDoseAndInstruction(this.newMedicineDetail.medicineDoses);
    if (this.appointmentId, this.newMedicineDetail.medicineName) {
      this._rxServices.saveMedicineDetails
        (this.appointmentId, this.newMedicineDetail.medicineName, this.newMedicineDetail.medicineType,
          this.newMedicineDetail.medicineDoses, this.newMedicineDetail.medicineDoseInstruction + ',',
          this.newMedicineDetail.medicineExtraInstruction, this.newMedicineDetail.medicineDays,
          this.newMedicineDetail.medicineQty, this.medicineItemList.length, 5)
        // (this.appointmentId, this.newMedicineDetail.medicineName, this.newMedicineDetail.medicineType,
        //   this.newMedicineDetail.medicineDoses, this.newMedicineDetail.medicineDays, this.newMedicineDetail.medicineQty)
        .subscribe(
          (res: Response) => {
            console.log(res);
            if (res.Status.toLowerCase().includes('success')) {
              this.loadRxListByAppointmentProcId();
              this.newMedicineDetail = new MedicinePrescription();
            }
          }, (err: Error) => {
            console.error(err);
            alert('Please check log, for more details.')
          }
        )
    } else {

    }
  }

  setMedicineDoseAndInstruction(_query: any) {
    //debugger
    this.newMedicineDetail.medicineDoses = _query.split('-')[0];
    this.newMedicineDetail.medicineDoseInstruction = _query.split('-')[1];
  }

  selectedTranLang: string = '';
  updateDoseDataBySelectedLang(lang: string) {
    if (lang) {
      this.selectedTranLang = lang.split('-')[1];
      this.dosesList = [];
      if (lang.toLowerCase().includes('en')) {
        this.dosesList = this.englishDoseTranslate;
      } else if (lang.toLowerCase().includes('hi')) {
        this.dosesList = this.hindiDoseTranslate;
      } else if (lang.toLowerCase().includes('mr')) {
        this.dosesList = this.marathiDoseTranslate;
      } else {
        this.dosesList = this.englishDoseTranslate;
      }
      this.saveMedicineDoseTranslateLang();
    } else {
      alert('Please try again.')
    }
  }

  setList() {
    this.medicineDoseLang = new List('RX_MED_DOSE_TRAN_LANG');
    // this.medicineDoseLang.ListType = ;
    this.medicineDoseLang.department = 'RX';
  }

  loadtMedicineDoseTranslateLang() {
    this._rxServices.getMedicineTranslatedLang().subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.medicineDoseLang = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details');
      }
    )
  }

  saveMedicineDoseTranslateLang() {
    if (this.medicineDoseLang.ListItemId < 0) {
      // this.medicineDoseLang.CreatedAt = this._commonService.trasformDateTimeByFormat() || '';
      this.medicineDoseLang.CreatedBy = this._commonService.getCurrentSessionUserId() || 0;
    }
    this._rxServices.saveMedicineTranslatedLang(this.medicineDoseLang).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success')) {
          this.loadtMedicineDoseTranslateLang()
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details.')
      }
    )
  }


  setSearchedMedicineName(_value: any) {
    //debugger
    console.log(_value);
    this.newMedicineDetail.medicineName = _value.ListItem ? _value.ListItem : '';
  }

  translate() {
    this._commonService.translateLangOneToAnotherLanguage(this.newMedicineDetail.medicineExtraInstruction, '', this.medicineDoseLang.ListItem).subscribe(
      (res: any) => {
        console.log(res);
        let _res = res[0][0][0];
        console.log(_res);
        if (_res) {
          if (this.newMedicineDetail.medicineExtraInstruction !== _res) {
            this.newMedicineDetail.medicineExtraInstruction = _res;
          }
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please try again!');
      }
    )
  }
}
