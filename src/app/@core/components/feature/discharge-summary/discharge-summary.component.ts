import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/@core/services/common.service';
import { DischargeSummaryManagementService } from 'src/app/@core/services/discharge-summary-management.service';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { RxManagementComponent } from '../rx-management/rx-management.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { AdmissionService } from 'src/app/@core/services/admission.service';
import { AttributeSetComponent } from '../attribute-set/attribute-set.component';
import { AppointmentService } from 'src/app/@core/services/appointment.service';
import { RxManagementService } from 'src/app/@core/services/rx-management.service';
import { List } from 'src/app/shared/modals/list';
import { RxPrescription } from 'src/app/shared/modals/rx-prescription';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { PatientAppointmentComponent } from '../patient-appointment/patient-appointment.component';
import { PatientDetailsComponent } from '../patient-details/patient-details.component';
import { PatientAdmissionComponent } from '../patient-admission/patient-admission.component';
import { PrintManagementService } from 'src/app/@core/services/print-management.service';
import { PrintJobDetail } from 'src/app/shared/modals/print-job-detail';
import { ConfTxt } from 'src/app/shared/modals/confTxt';

class PrintGroupItemDetails {
  printGroupName: string = '';
  printGroupValue: any[] = [];
}

class TemplateDetail {
  templateId: number = 0;
  templateName: string = '';
}

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
  selector: 'app-discharge-summary',
  imports: [CommonModule, PrimeNgModule, FormsModule],
  providers: [DialogService, DynamicDialogConfig, ConfirmationService],
  templateUrl: './discharge-summary.component.html',
  styleUrl: './discharge-summary.component.css'
})
export class DischargeSummaryComponent implements OnInit, DoCheck {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private _dischargeSummaryServices: DischargeSummaryManagementService,
    private _commonServices: CommonService,
    private _dialogService: DialogService,
    private _dialogConfig: DynamicDialogConfig,
    private _activatedRoute: ActivatedRoute,
    private _patientService: PatientManagementService,
    private _admissionService: AdmissionService,
    private _appointmentServices: AppointmentService,
    private _rxServices: RxManagementService,
    private _confirmationService: ConfirmationService,
    private _printerJob: PrintManagementService
  ) { }

  screenHeight: string = '';
  hospitalSection: string = '';
  ngOnInit(): void {
    this.loadtMedicineDoseTranslateLang();
    this.loadDefaaultReportDetailByUserId();
    // window.addEventListener('scroll',()=>{
    //   console.log(window.scrollY);
    // })
    this.hospitalSection = this._commonServices.getHospitalSection();
    console.log(this.hospitalSection);
    this.screenHeight = environment.screenHeight.toString() + 'px' || '90vh';
    let _data = this._dialogConfig.data || null;
    this.patientId = history.state.patientId || 0;
    this.appointmentId = environment.hospitalSection.toLowerCase().includes('ipd') ? history.state.admissionId : history.state.appointmentId || 0;
    this.dosesList = this.englishDoseTranslate;
    // //debugger
    this._activatedRoute.queryParams.subscribe(
      (param: any) => {
        //debugger
        // console.log(param);
        this.appointmentId = Number(param['appointmentId'] && param['appointmentId'] != undefined ? param['appointmentId'] : param['admissionId']) || 0;
        this.patientId = Number(param['patientId']) || 0;
        this.appointmentProcId = Number(param['procId']) || 0;
        this.noteType = param['noteType'] || '';
        this.printingReportDetail.appointmentId = this.appointmentId;
      }
    )

    if (_data) {
      this.appointmentProcId = _data.appointmentProcId;
      this.appointmentId = _data.appointmentId;
      this.noteType = _data['noteType'] || '';
      this.printingReportDetail.appointmentId = _data.appointmentProcId;
    }


    // if (!_data) {
    //   let _procId = history.state.procId || null;
    //   if (_procId) {
    //     this.appointmentProcId = _procId;
    //   }
    // }

    debugger

    if (this.patientId) {
      this.loadPatientDetails(this.patientId);
    }

    if (this.patientId && this.appointmentId && environment.hospitalSection.toLowerCase().includes('ipd')) {
      this.loadAddmissionDetailsByAdmissionId(this.appointmentId, this.patientId);
    }

    if (this.appointmentId && environment.hospitalSection.toLowerCase().includes('opd')) {
      this.loadAppointmentDetailsByAppointmentId(this.appointmentId);
    }

    if (this.noteType.toLowerCase().trim().includes('note')) {
      this.loadNoteSummaryByPatientAppointmentIdDischargeSetIdHospitalSection()
    } else {
      this.loadDichargeSummaryByPatientAppointmentIdDischargeSetIdHospitalSection();
    }

    this.loadTemplateList();

    this.loadRxListByAppointmentProcId();
    console.log(history.state);
    console.log(_data);

    setTimeout(() => {
      if (this.medicineDoseLang.ListItemId > 0) {
        this.updateDoseDataBySelectedLang(this.medicineDoseLang.ListItem);
      }
    }, 1000);
    environment.navigatedScreenName = this.hospitalSection.toUpperCase() + ' - Discharge Summary'

  }

  ngDoCheck(): void {

  }

  appointmentProcId: number = 0;
  appointmentId: number = 0;
  patientId: number = 0;
  stateOptions: any[] = [{ label: 'Summary', value: 'summary' }, { label: 'RX', value: 'rx' }];
  statusValue: string = 'summary';
  isSaved: boolean = false;
  loadDichargeSummaryByPatientAppointmentIdDischargeSetIdHospitalSection() {
    this._commonServices.activeLoader();
    let _id = environment.hospitalSection.toLowerCase().includes('ipd') ? this.appointmentProcId : this.appointmentId;
    this._dischargeSummaryServices.getDischargeSummary(_id).subscribe(
      (res: Response) => {
        console.log(res);
        this._commonServices.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.filterPrintGroupName(res.dataSet.Table);
          this.printingReportDetail.appointmentId = _id
          this.printingReportDetail.whichOpd = this.hospitalSection;
        } else if (res.Status.toLowerCase().includes('success') && !res.noofREcords) {
          this.showAttributeListDialog();
        } else {
          alert('Please check log, for more details');
        }
      }, (err: Error) => {
        this._commonServices.deactiveLoader();
        console.error(err);
      }
    )
  }

  noteType: string = '';
  loadNoteSummaryByPatientAppointmentIdDischargeSetIdHospitalSection() {
    this._commonServices.activeLoader();
    let _id = environment.hospitalSection.toLowerCase().includes('ipd') ? this.appointmentProcId : this.appointmentId;
    this._dischargeSummaryServices.getNoteSummary(_id, this.noteType).subscribe(
      (res: Response) => {
        console.log(res);
        this._commonServices.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.filterPrintGroupName(res.dataSet.Table);
          this.printingReportDetail.appointmentId = _id
          this.printingReportDetail.whichOpd = this.hospitalSection;
        } else if (res.Status.toLowerCase().includes('success') && !res.noofREcords) {
          this.showAttributeListDialog();
        } else {
          alert('Please check log, for more details');
        }
      }, (err: Error) => {
        this._commonServices.deactiveLoader();
        console.error(err);
      }
    )
  }

  dischareSummarySetItems: PrintGroupItemDetails[] = [];

  filterPrintGroupName(_item: any[]) {
    if (_item.length) {
      this.dischareSummarySetItems = [];
      let _printGroupName: string = '';
      for (let i = 0; i < _item.length; i++) {
        let _printGroupItem: PrintGroupItemDetails = new PrintGroupItemDetails();
        if (i === 0) {
          _printGroupName = _item[i].PrintGroup;
          _printGroupItem.printGroupName = _printGroupName;
          // _printGroupItem.printGroupValue = _item[i];
          this.dischareSummarySetItems.push(_printGroupItem)
        } else {
          if (_printGroupName.toLowerCase().trim() != _item[i].PrintGroup.toLowerCase().trim()) {
            _printGroupName = _item[i].PrintGroup;
            _printGroupItem.printGroupName = _printGroupName;
            this.dischareSummarySetItems.push(_printGroupItem)
          }
        }
      }
      this.filterPrintGroupValues(_item);
      console.log(this.dischareSummarySetItems);
    } else {

    }
  }

  filterPrintGroupValues(_itemList: any[]) {
    if (this.dischareSummarySetItems.length && _itemList.length) {
      this.dischareSummarySetItems.forEach(
        (z: PrintGroupItemDetails) => {
          _itemList.forEach(
            (y: any) => {
              if (z.printGroupName.toLowerCase().trim() === y.PrintGroup.toLowerCase().trim()) {
                if (y.AttributeValue) {
                  if (y.AttributeValue.toLowerCase().trim().includes('edit')) {
                    y.AttributeValue = null;
                  }
                } else {
                  y.AttributeValue = null;
                }


                if (y.DefaultValue) {
                  if (y.DefaultValue.toLowerCase().trim().includes('edit')) {
                    y.DefaultValue = null;
                  }
                } else {
                  y.DefaultValue = null;
                }

                z.printGroupValue.push(y);
              }
            }
          )
        }
      )
      console.log(this.dischareSummarySetItems);
      this.filterDichargeSummaryListByGroupName('');
    }
  }

  loadedList: any[] = []
  loadListByPrintGroupAttribute(_script: string) {
    this.loadedList = [
      {
        ListItem: "Loading Data",
        ListParam: null,
        ListItemId: 0,
        SeqNo: 0
      }
    ]
    this._dischargeSummaryServices.getListByPrintGroupAttribute(_script).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.loadedList = res.dataSet.Table;
        } else {
          this.loadedList = [
            {
              ListItem: "No Data",
              ListParam: null,
              ListItemId: 0,
              SeqNo: 0
            }
          ]
        }
      }, (err: Error) => {
        console.error(err);
        this.loadedList = [
          {
            ListItem: "No Data",
            ListParam: null,
            ListItemId: 0,
            SeqNo: 0
          }
        ]
      }
    )
    return this.loadedList;
  }

  multiSelection(_iIndex: number, _jIndex: number, _value: string, eventTarget: any) {
    //debugger
    let _isChecked = eventTarget.checked;
    if (this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue) {
      if (this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue.toLowerCase().includes(_value.toLowerCase())) {
        if (!_isChecked) {
          let _text = _value;
          let _previousValue: string[] = this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue.split('|') || '';
          let _i: number = 0;
          this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue = '';
          _previousValue.forEach(
            (z: string) => {
              if (z.toLowerCase().trim() !== _value.toLowerCase().trim()) {
                if (z.toLowerCase().trim() !== _value.toLowerCase().trim()) {
                  if (z) {
                    this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue = this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue + z.trim() + '|';
                  }
                }
                // else {
                //   if (z) {
                //     this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue = this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue + '| ' + z.trim();
                //   }
                // }
              }
            }
          );
          console.log(_previousValue);
          //debugger
          this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue = '|' + this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue;
          this.updateAttributeValue(this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].EntityAttributeId, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeId, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].SetName)
        }
      } else {
        if (_isChecked) {
          let _x = this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue.trim();
          _x = _x[_x.length - 1] === '|' ? '' : '| ';
          this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue = this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue + _x + _value + '|';
          this.updateAttributeValue(this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].EntityAttributeId, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeId, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].SetName)
        }
      }
    } else {
      if (_isChecked) {
        this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue = '|' + _value + '|'
        this.updateAttributeValue(this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].EntityAttributeId, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeId, this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].SetName)
      }
    }
    console.log(this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].AttributeValue);
  }

  checkIsValueInParameter(_value: string, _attribute: any, _attributeName?: string) {
    //debugger
    let _attributeValue = _attribute.AttributeValue ? _attribute.AttributeValue.includes('|') ? _attribute.AttributeValue.split('|') : '' : '';
    let _res: boolean = false;
    if (_attributeValue) {
      for (let attr of _attributeValue) {
        if (_value.toLowerCase().trim() === attr.toLowerCase().trim()) {
          _res = true;
        }
      }
    }
    // else {
    //   // for (let attr of _attribute) {
    //   if (_attribute.AttributeValue && _attribute.AttributeName.toLowerCase() === _attributeName?.toLowerCase()) {
    //     console.log(_attribute);
    //     if (_value.toLowerCase().trim() === _attribute.AttributeValue.toLowerCase().trim()) {
    //       _res = true;
    //     }
    //   }
    //   // }
    // }
    return _res;

    // if (this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].DefaultValue) {
    //   if (this.dischareSummarySetItems[_iIndex].printGroupValue[_jIndex].DefaultValue.toLowerCase().includes(_value)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
  }

  _color: string = 'FDDE55'

  validateDischargeSummaryValues(_value: any, _id: string) {
    //debugger
    if (_value) {
      let _ele = document.getElementById(_id);
    } else {

    }
  }

  showAttributeListDialog() {

    let _ref = this._dialogService.open(AttributeSetComponent, {
      header: 'Set List',
      width: 'auto',
      position: 'bottom',
      height: 'auto',
      data: {
        appointmentId: environment.hospitalSection.toLowerCase() === 'ipd' ? this.appointmentProcId : this.appointmentId,
        setName: ''
      }
    })

  }

  showPrescriptionDialog() {

    let _ref = this._dialogService.open(RxManagementComponent, {
      header: 'Prescription Summary',
      width: '100%',
      position: 'bottom',
      height: '100%',
      data: {
        appointmentId: this.appointmentProcId,
        setName: 'all'
      }
    })
  }

  filteredGroupList: PrintGroupItemDetails[] = []
  filterDichargeSummaryListByGroupName(_groupName: string) {
    //debugger
    if (_groupName) {
      console.log(_groupName);
      let _filteredList: PrintGroupItemDetails[] = [];
      for (let item of this.dischareSummarySetItems) {
        //debugger
        if (item.printGroupName.toLowerCase().includes(_groupName.toLowerCase())) {
          _filteredList.push(item);
        }
      }
      this.filteredGroupList = _filteredList
    } else {
      this.filteredGroupList = this.dischareSummarySetItems;
    }
  }


  clearSearchedValue(_value: string) {
    //debugger
    let _ele: any = document.getElementById('groupNameTextId');
    if (_ele?.value) {
      _ele.value = '';
      this.filterDichargeSummaryListByGroupName(_ele.value);
    }
  }


  updateAttributeValue(_attributeValue: string, _entityAttributeId: number, _attributeId: number, _setName: string) {
    //debugger
    this.showInProcessStatus('', false, true)
    this._dischargeSummaryServices.saveAttributeValueByEntityAtrributeIdAttributeIdSetName(_attributeValue, _entityAttributeId, _attributeId, _setName).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          alert('Successfully Done!');
          this.showInProcessStatus('', true, false);
          this.showPreviousData = false;
        }
        if (res.Status.toLowerCase().includes('failed')) {
          this.showPreviousData = false;
          this.showInProcessStatus('', true, false);
          this.showPreviousData = false;
          // alert('Failed!');
        }
        setTimeout(() => {
          this.showInProcessStatus('', false, false);
        }, 2000);
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.');
        this.showInProcessStatus('', false, false);
      }
    )
  }

  saveNoteDetailByNoteTypePatientIdAdmissionId() {
    this._dischargeSummaryServices.saveNoteByEntityAtrributeIdAttributeIdSetName(this.appointmentProcId, this.patientId, this.appointmentId, this.noteType).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.isSaved_1 = !this.isSaved_1
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  isChecked(_value: string, isChecked?: boolean) {
    //debugger
    let _res: boolean = false;
    if (_value) {
      if (_value.toLowerCase() === 'selected') {
        _res = true;
      }
      if (_value.toLowerCase() === 'not selected') {
        _res = false;
      }
      if (!_value) {
        _res = false;
      }
    }
    return _res;
  }

  patientDetails: any = null
  loadPatientDetails(patientId: number) {
    this._patientService.getPatientDetailsByPatientId(patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.patientDetails = null;
          this.patientDetails = res.dataSet.Table[0];
          this.printingReportDetail.patientId = this.patientDetails.EntityId;
          this.printingReportDetail.patientName = this.patientDetails.EntityName;
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  admissionDetails: any = null
  loadAddmissionDetailsByAdmissionId(admissionId: number, patientId: number) {
    this._admissionService.getAddmissionDetailsByAdmissionIdPatientId(admissionId, patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.admissionDetails = null;
          this.admissionDetails = res.dataSet.Table[0];
          this.loadPreviousAdmissionListByPatientId(this.admissionDetails.PatientId)
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  loadAppointmentDetailsByAppointmentId(admissionId: number) {
    this._appointmentServices.getAppointmentDetailsByAppointmentId(admissionId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.admissionDetails = null;
          this.admissionDetails = res.dataSet.Table[0];
          this.loadPatientDetails(this.admissionDetails.EntityId);
          this.loadPreviousAppointmentListByPatientId(this.admissionDetails.EntityId)
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  selectedPreviousDataInfomation: any = {
    iIndex: 0,
    jIndex: 0,
    header: '',
    data: null
  }

  setSelectedPreviousData(_data: any, _iIndex: number, _jIndex: number, _header: string) {
    this.selectedPreviousDataInfomation.iIndex = _iIndex;
    this.selectedPreviousDataInfomation.jIndex = _jIndex;
    this.selectedPreviousDataInfomation.data = _data;
    this.selectedPreviousDataInfomation.header = _header;
    this.isWrappedData = false;
  }


  showPreviousData: boolean = false;
  showLargeText: boolean = false;
  showPatientDetails: boolean = false;

  previousAppointmentList: any[] = [];
  loadPreviousAppointmentListByPatientId(patientId?: number) {
    this._appointmentServices.getPreviousAppointmentListByPatientId(patientId ? patientId : this.patientId).subscribe(
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
  }

  loadPreviousAdmissionListByPatientId(patientId?: number) {
    this._admissionService.getPreviousAdmissionListByPatientId(patientId ? patientId : this.patientId).subscribe(
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
  }

  convertIntoString(_value: any) {
    return String(_value)
  }

  convertPipeValuesIntoStringArray(_value: string, _attribute: any, _checkBoxValue: string) {

    //debugger

    let _attributeValue = _attribute.AttributeValue || '';
    _attributeValue = _attributeValue.split('|');

    console.log(_attributeValue);

  }

  isWrappedData: boolean = false;
  wrapupExtraProcedureText(_textValue: string, letterCount?: number) {
    // //debugger
    this.isWrappedData = false;
    let _returnValue: string = ''
    let _minLetterCount: number = 0;
    _minLetterCount = letterCount ? letterCount - 2 : 0;
    if (_textValue.toLowerCase().includes('acute febrile illness with thrombocy')) {
      //debugger
    }
    if (_textValue) {
      if (_textValue.length > (letterCount || 40)) {
        this.isWrappedData = true;
        for (let i = 0; i < (letterCount ? letterCount : 45); i++) {
          if (i <= (_minLetterCount ? _minLetterCount : 43)) {
            _returnValue = _returnValue + _textValue[i];
          } else {
            _returnValue = _returnValue + '...'
          }
        }
      } else {
        this.isWrappedData = false;
        _returnValue = _textValue
      }
    }
    return _returnValue;
  }


  wrappedData: any = null;

  updateDischargeSummaryAttributeValueBySelectedPreviousData(_data: any) {
    //debugger
    this.dischareSummarySetItems[this.selectedPreviousDataInfomation.iIndex].printGroupValue[this.selectedPreviousDataInfomation.jIndex].AttributeValue = _data;
    this.updateAttributeValue(this.dischareSummarySetItems[this.selectedPreviousDataInfomation.iIndex].printGroupValue[this.selectedPreviousDataInfomation.jIndex].AttributeValue, this.selectedPreviousDataInfomation.data.EntityAttributeId, this.selectedPreviousDataInfomation.data.AttributeId, this.selectedPreviousDataInfomation.data.SetName);
  }

  replaceDropdownAttributeValue(_value: string) {
    //debugger
    let _list = _value ? _value.split('|') : [];
    let _returnValue: string = '';

    if (_list.length) {
      for (let data of _list) {
        if (data) {
          _returnValue = _returnValue + data + ', ';
        }
      }
    } else {
      _returnValue = 'Select value...'
    }

    return _returnValue;
  }



  validPlatform(_query: string) {
    return this._commonServices.checkPlatform(_query);
  }

  newMedicineDetail: MedicinePrescription = new MedicinePrescription();
  medicineItemList: any[] = [];
  dosesList: any = []
  medicineDoseLang: List = new List('RX_INSTRUCTION_TRANS_LANG');
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

  setSearchedMedicineName(_value: any) {
    //debugger
    console.log(_value);
    this.newMedicineDetail.medicineName = _value.ListItem ? _value.ListItem : '';
  }

  loadMedicineItemList(_searchQuery?: string) {
    //debugger

    // console.log(this.selectedMedcineDetails);
    // console.log(_searchQuery);

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

  saveMedicineDoseTranslateLang() {
    if (this.medicineDoseLang.ListItemId < 0) {
      // this.medicineDoseLang.CreatedAt = this._commonService.trasformDateTimeByFormat() || '';
      this.medicineDoseLang.CreatedBy = this._commonServices.getCurrentSessionUserId() || 0;
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

  rxPrescriptionList: RxPrescription[] = [];
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

  translate() {
    this._commonServices.translateLangOneToAnotherLanguage(this.newMedicineDetail.medicineExtraInstruction, '', this.medicineDoseLang.ListItem).subscribe(
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

  // editMedicineDetail(_data: any) {
  //   if(_data){
  //     this.newMedicineDetail = new MedicinePrescription();
  //     this.newMedicineDetail.
  //   } else {

  //   }
  // }

  selectedPrescriptionId: number = 0;
  deletePrescription() {
    let _temp
    this._rxServices.deleteMedicineFromPrescriptionByPrescriptionIdAppointmentId(this.selectedPrescriptionId, this.appointmentId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('sucess') && res.Data) {
          this.loadRxListByAppointmentProcId();
        }
        if (res.Status.toLowerCase().includes('failed') && res.myError.toLowerCase() === this._commonServices._tempFailedMessage.toLowerCase()) {
          this.loadRxListByAppointmentProcId();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more details');
      }
    )
  }

  showDeletePopUp(event: Event, prescriptionId: number) {
    this.selectedPrescriptionId = prescriptionId;
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to delete this medicine ?',
      accept: () => {
        this.deletePrescription()
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  selectedLargeTextDetails: string = '';
  showLargeTextData(_value: any) {
    if (_value) {
      this.selectedLargeTextDetails = _value;
      this.showLargeText = true;
    }
  }

  showPatientAppointmentDialoge() {
    let ref = this._dialogService.open(PatientAppointmentComponent, {
      header: 'Patient Details - '
        + this.patientDetails.EntityName.toUpperCase()
      ,
      width: '50%',
      data: {
        patientId: this.patientDetails.EntityId,
        appointmentId: this.admissionDetails.AppointmentId
      }
    })
  }

  showPatientAdmissionDialoge() {
    let ref = this._dialogService.open(PatientAdmissionComponent, {
      header: 'Patient Details - '
        + this.patientDetails.EntityName.toUpperCase()
      ,
      width: '50%',
      data: {
        patientId: this.patientDetails.EntityId,
        admissionId: this.admissionDetails.AdmissionId
      }
    })
  }

  showAdmissionAppointmentFormByHospitalSection() {
    if (this.hospitalSection.toLowerCase().includes('ipd')) {
      this.showPatientAdmissionDialoge()
    }
    if (this.hospitalSection.toLowerCase().includes('opd')) {
      this.showPatientAppointmentDialoge();
    }
  }

  showPatientDetailsDialoge() {
    // console.log(this.selectedIpdDetails);
    let ref = this._dialogService.open(PatientDetailsComponent, {
      header: 'Patient Details - '
        + this.patientDetails.EntityName.toUpperCase()
      ,
      width: '50%',
      data: {
        patientId: this.patientDetails.EntityId,
      }
    })
  }

  showInProcess: boolean = false;
  processHeaderName: string = '';
  isInProcess: boolean = false;
  isSaved_1: boolean = false;
  showInProcessStatus(_headerName: string, _isSaved: boolean, _isProcess: boolean) {
    this.showInProcess = _isProcess || _isSaved ? true : false;
    this.processHeaderName = _headerName,
      this.isInProcess = _isProcess;
    this.isSaved = _isSaved;
  }

  printingReportDetail: PrintJobDetail = new PrintJobDetail();
  printReport() {
    this.printingReportDetail.printerName = 'Microsoft Print to PDF';
    debugger
    this._printerJob.savePrintJob(this.printingReportDetail).subscribe(
      (res: Response) => {
        console.log(res);
        setTimeout(() => {
          this.downloadReportFile(this.printingReportDetail)
        }, 3000);
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  downloadReportFile(_reportName: PrintJobDetail) {
    debugger
    let _date = this._commonServices.trasformDateTimeByFormat('dd MMM yyyy');
    let _temType = ''

    if (this.hospitalSection.toLowerCase().includes('ipd')) {
      _temType = 'Discharge_'
    }

    if (this.hospitalSection.toLowerCase().includes('opd')) {
      _temType = 'OPD_CARD_'
    }

    let _fileName = _temType + _reportName.patientName + '_' + _date?.replaceAll(' ', '_');

    debugger

    this._printerJob.getReportFile(_fileName).subscribe(
      (res: any) => {
        debugger
        // console.log(res);
        // window.open('', res);
        // const blob = new Blob(res);

        // // Create an object URL for the Blob
        // const blobUrl = URL.createObjectURL(blob);

        // // Open the PDF in a new tab
        // window.open(res, '_blank');


        // res.data ? res.data = res.data.replaceAll('\r\n', '\n') : null;
        // res.data ? res.data = res.data.replaceAll('\n\n', '\n') : null;

        const printWindow = window.open('', _fileName, '0');
        let _html = res.data;
        _html = _html ? _html.replaceAll('HTML_Assets','assets') : '';
        console.log(_html);
        if (printWindow) {
          //debugger
          printWindow.document.write(_html);
          printWindow.document.close();
          printWindow.print();
        } else {
          console.error('Failed to open print window');
        }

        // let html = '<html><head></head><body>ohai</body></html>';
        // let uri = "data:text/html," + encodeURIComponent(html);
        // let newWindow = window.open(uri);
        // newWindow?.open();
        // const reader = new FileReader();

        // reader.onload = (event: any) => {
        //   const fileContent = event.target.result;
        //   console.log(fileContent); // Do something with the file content
        // };

        // reader.readAsText(res);
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(res);
        // link.download = res.fileDownloadName;  // You can set the default file name here
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  defaultReportDetail: ConfTxt = new ConfTxt();
  loadDefaaultReportDetailByUserId() {
    this._printerJob.getDefaultReportDetailByUserId().subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('succes') && res.noofREcords) {
          this.defaultReportDetail = new ConfTxt();
          this.defaultReportDetail = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  templateList: TemplateDetail[] = []
  loadTemplateList() {
    this._printerJob.getTemplateList(this.hospitalSection).subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.templateList = [];
          let _list = res.dataSet.Table;
          _list.forEach(
            (z: any) => {
              let _template: TemplateDetail = new TemplateDetail();
              if (z.ReportName) {
                if (!z.ReportName.toLowerCase().includes('consent')) {
                  _template.templateId = z.ReportId;
                  _template.templateName = z.ReportName;
                  this.templateList.push(_template)
                }
              }
            }
          )
          console.log(this.templateList);
        }
        this.loadDefaultSetTemplateName()
      }, (err: Error) => {
        console.error(err);
        this.loadDefaultSetTemplateName()
      }
    )
  }

  setDischargeTemplate(_templateName: string) {
    let _key: string = ''
    if (this.hospitalSection.toLowerCase() === 'ipd') {
      _key = 'IPD_Card'
    }
    if (this.hospitalSection.toLowerCase() === 'OPD') {
      _key = 'OPD_Card'
    }
    localStorage.setItem(_key, _templateName);
  }

  loadDefaultSetTemplateName() {
    // debugger
    let _key: string = ''
    if (this.hospitalSection.toLowerCase() === 'ipd') {
      _key = 'IPD_Card'
    }
    if (this.hospitalSection.toLowerCase() === 'OPD') {
      _key = 'OPD_Card'
    }
    this.printingReportDetail.reportName = localStorage.getItem(_key)?.toString() || '';
  }

}
