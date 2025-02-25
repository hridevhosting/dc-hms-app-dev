import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AdmissionService } from 'src/app/@core/services/admission.service';
import { AppointmentService } from 'src/app/@core/services/appointment.service';
import { BillManagementService } from 'src/app/@core/services/bill-management.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { BillDetail } from 'src/app/shared/modals/bill-detail';
import { BillItemDetail } from 'src/app/shared/modals/bill-item-detail';
import { BillReceipt } from 'src/app/shared/modals/bill-receipt';
import { List } from 'src/app/shared/modals/list';
import { PatientDetail } from 'src/app/shared/modals/patient-detail';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { environment } from 'src/environments/environment';
import { __spreadArray } from 'tslib';
import { BillReceiptComponent } from '../bill-receipt/bill-receipt.component';
import { BillItemCharge } from 'src/app/shared/modals/bill-item-charge';
import { BillItemRateDetail } from 'src/app/shared/modals/bill-item-rate-detail';
import { PathTestDetail } from 'src/app/shared/modals/path-test-detail';

@Component({
    selector: 'app-billing-management',
    imports: [PrimeNgModule, CommonModule, FormsModule],
    providers: [DynamicDialogConfig, DialogService],
    templateUrl: './billing-management.component.html',
    styleUrl: './billing-management.component.css'
})
export class BillingManagementComponent implements OnInit, DoCheck {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private _billServices: BillManagementService,
    private _dialogConfig: DynamicDialogConfig,
    private _patientServices: PatientManagementService,
    private _activatedRoute: ActivatedRoute,
    private _appointmentServices: AppointmentService,
    private _admissionServices: AdmissionService,
    private _commonServices: CommonService,
    private _confirmationService: ConfirmationService,
    public _dialogService: DialogService
  ) { }

  ngOnInit(): void {
    debugger
    this.loadTpaList();
    this.loadPayerList();
    // this.loadSubRateTypeList();
    let _data = this._dialogConfig.data || null;
    if (_data) {
      this.billNo = _data.billNo || 0;
      this.billType = _data.billType || '';
      if (this.billNo) {
        console.log(this.billNo);
        this.loadBillDetailsByBillId(this.billNo);
      }
    }

    if (!_data) {
      this._dialogService.dialogComponentRefMap.forEach(dialog => {
        dialog.destroy();
      });
      this._activatedRoute.queryParams.subscribe(
        (param: any) => {
          this.billNo = param.billId ? Number(param.billId) : 0;
          this.caseId = param.caseId ? Number(param.caseId) : 0;
          this.patientId = param.patientId ? Number(param.patientId) : 0;
          // this.billType = environment.hospitalSection;
        }
      )
      this.billType = !this.billType ? history.state.hospitalSection : this.billType;
      this.loadBillDetailsByBillId(this.billNo);

    }

    if (!this.billType.toLowerCase().includes('path')) {
      this.loadRateTypeList();
    } else {
      this.loadPathLabTestList();
    }

    this._commonServices.setHospitalSection(environment.hospitalSection === this.billType ? environment.hospitalSection : environment.hospitalSection + ' > ' + this.billType + ' - Bill Management');

  }

  ngDoCheck(): void {
    // this.setFloatingAmountCard()
  }

  caseId: number = 0;
  patientId: number = 0;
  billNo: number = 0;
  visible: boolean = false;
  billDetail: BillDetail = new BillDetail();
  billItemDetails: BillItemDetail[] = [];
  patientDetail: PatientDetail = new PatientDetail();
  moreDetails: boolean = false;
  billChargesPopup: boolean = false;
  billType: string = '';
  stateOptions: any[] = [{ label: 'Charges', value: 'bill' }, { label: 'Receipts', value: 'receipt' }];
  value: string = 'bill';
  payerList: List[] = [];
  tpaList: List[] = [];
  isRefreshing: boolean = false;
  loadBillDetailsByBillId(billNo: number) {
    this.isRefreshing = true;
    if (billNo) {
      this._billServices.getBillDetailsByBillNo(billNo).subscribe(
        (res: Response) => {
          this.isRefreshing = false;
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            // //debugger
            this.billDetail = new BillDetail();
            this.billDetail = res.dataSet.Table[0];
            let _pathBillSection = ''
            if (this.billType.toLowerCase() === 'path') {
              _pathBillSection = this.billType;
            }
            let _hospitalSection = this._commonServices.getHospitalSection();
            if (_hospitalSection) {
              this.billType = _pathBillSection ? _pathBillSection : _hospitalSection;
              console.log(this.billType);
              if (_hospitalSection.toLowerCase().includes('opd')) {
                console.log('Load OPD Details');

                this.loadAppointmentDetailsByAppointmentId();
              }
              if (_hospitalSection.toLowerCase().includes('ipd')) {
                console.log('Load IPD Details');

                this.loadAdmissionDetailsByAdmissionId();
              }
            }
            this.loadBillItemDetailsByBillId(this.billNo);
            this.loadPatientDetail(this.billDetail.PatientId);

            // this._commonServices.setHospitalSection(environment.hospitalSection + ' ' + this.billDetail.B_WhichOpd.toUpperCase() + ' - Bill Management');
          }
        }, (err: Error) => {
          console.error(err);
          this.isRefreshing = false;
          alert('Please check log, for more detail.')
        }
      )

      // this._billServices.getBillDetailByCaseIdPatientIdHospitalSection(this.caseId, this._commonServices.trasformDateTimeByFormat('dd MMM yyyy') || '', this.patientId, this._commonServices.getHospitalSection()).subscribe(
      //   (res: Response) => {
      //     console.log(res);
      //     if (res.Status.toLowerCase().includes('success')) {

      //     }
      //   }, (err: Error) => {
      //     console.error(err);
      //     alert('Please check log, for more detail');
      //   }
      // )
    }
  }

  loadBillItemDetailsByBillId(billNo: number) {
    this._billServices.getBillItemDetailsByBillNo(billNo).subscribe(
      (res: Response) => {
        console.log(res);
        this.loadReceiptListByBillId();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.billItemDetails = [];
          this.billItemDetails = res.dataSet.Table;
          let _chargedAmount: any = 0
          this.billItemDetails.forEach((bi: BillItemDetail) => {
            if (bi.Code !== 'Receipt') {
              _chargedAmount = _chargedAmount + bi.Amount;
            }
          });
          this.chargedAmount = _chargedAmount.toString();
          if (this.validPlatform('window')) {
            //debugger
            this.setFloatingAmountCard();
          }
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  loadPatientDetail(patientId?: number) {
    this._patientServices.getPatientDetailsByPatientId(patientId ? patientId : this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.patientDetail = new PatientDetail();
          this.patientDetail = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  appointmentDetails: any = null;
  admissionDetails: any = null;
  loadAppointmentDetailsByAppointmentId() {
    this._appointmentServices.getAppointmentDetailsByAppointmentIdPatientId(this.caseId, this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.appointmentDetails = null;
          this.appointmentDetails = res.dataSet.Table[0];
          console.log('Appointment Detail =>', this.appointmentDetails);

        }
      }, (err: Error) => {
        console.error("getAppointmentDetailsByAppointmentIdPatientId =>", err);
        alert('Please check log, for more details.')
      }
    )
  }

  loadAdmissionDetailsByAdmissionId() {
    this._admissionServices.getAddmissionDetailsByAdmissionIdPatientId(this.caseId, this.patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.admissionDetails = null;
          this.admissionDetails = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error("getAddmissionDetailsByAdmissionIdPatientId =>", err);
        alert('Please check log, for more details.')
      }
    )
  }

  chargedAmount: string = '0';
  patientGivenAmount: number = 0;
  patientBalanceAmount: number = 0;
  receiptList: BillReceipt[] = [];
  loadReceiptListByBillId() {
    this._billServices.getRecieptListByBillId(this.billDetail.BillNo).subscribe(
      (res: Response) => {
        console.log("getRecieptListByBillId =>", res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.receiptList = [];
          this.receiptList = res.dataSet.Table;
        }
        this.calculatePatientGivenAndBalance()
      }, (err: Error) => {
        console.error("getRecieptListByBillId =>", err);
        alert('Please check log, for more details');
      }
    )
  }


  calculatePatientGivenAndBalance() {
    //debugger
    this.patientGivenAmount = 0;
    this.patientBalanceAmount = 0;
    if (this.receiptList.length) {
      this.receiptList.forEach(
        (r: BillReceipt) => {
          this.patientGivenAmount = r.Receipts + this.patientGivenAmount;
        }
      )
    }
    this.patientBalanceAmount = Number(this.chargedAmount) - this.patientGivenAmount;
  }


  showBillLockAlertPopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to lock bill ' + this.billDetail.IPCaseNo.toUpperCase() + ' ?',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  showBillSaveAlertPopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to save bill ' + this.billDetail.IPCaseNo.toUpperCase() + ' ?',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  showBillItemDeleteAlertPopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to delete this charge?',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.deleteBillItemByBillItemIdBillNo();
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  showBillItemChargeAlertPopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to add this charge?',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  loadPayerList() {
    this._commonServices.getPayerList().subscribe(
      (res: Response) => {
        console.log("getPayerList =>", res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.payerList = [];
          this.payerList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error("getPayerList =>", err);
        alert('Please check log, for more details');
      }
    )
  }

  loadTpaList() {
    this._commonServices.getTpaList().subscribe(
      (res: Response) => {
        console.log("getTpaList =>", res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.tpaList = [];
          this.tpaList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error("getTpaList =>", err);
        alert('Please check log, for more details');
      }
    )
  }

  showReceiptDialoge() {
    let ref = this._dialogService.open(BillReceiptComponent, {
      header: 'Receipt For ' + this.billDetail.IPCaseNo.toUpperCase(),
      width: 'auto',
      data: {
        // ipdPatientDetail: this.selectedIpdDetails,
        billNo: this.billDetail.BillNo.toString() || '',
        receivedAmount: this.patientGivenAmount,
        billType:this.billType
      }
    })
  }



  validPlatform(_query: string) {
    return this._commonServices.checkPlatform(_query);
  }


  floatAmountCardPostion: string = 'position:sticky; bottom: 0%;'
  setFloatingAmountCard() {
    //debugger
    if (this.value.toLowerCase().includes('bill') && !this.billItemDetails.length) {
      this.floatAmountCardPostion = 'position:absolute; bottom: 0%;';
    } else if (this.value.toLowerCase().includes('bill') && this.billItemDetails.length < 7) {
      this.floatAmountCardPostion = 'position:absolute; bottom: 0%;';
    } else if (this.value.toLowerCase().includes('bill') && this.billItemDetails.length >= 7) {
      this.floatAmountCardPostion = 'position:sticky; bottom: 0%;';
    } else if (this.value.toLowerCase().includes('receipt') && !this.receiptList.length) {
      this.floatAmountCardPostion = 'position:absolute; bottom: 0%;';
    } else if (this.value.toLowerCase().includes('receipt') && this.receiptList.length < 7) {
      this.floatAmountCardPostion = 'position:absolute; bottom: 0%;';
    } else if (this.value.toLowerCase().includes('receipt') && this.receiptList.length >= 7) {
      this.floatAmountCardPostion = 'position:sticky; bottom: 0%;';
    } else {
      this.floatAmountCardPostion = 'position:absolute; bottom: 0%;'
    }
  }

  rateTypeList: string[] = []
  rateSubTypeList: string[] = []

  selectedRateType: string = '';
  selectedRateSubType: string = '';

  loadRateTypeList() {
    this._billServices.getRateTypeList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.rateTypeList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              this.rateTypeList.push(z.ListItem)
            }
          });
          this.selectedRateType = this.rateTypeList[0];
          this.loadSubRateTypeList();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  loadSubRateTypeList() {
    this._billServices.getSubRateTypeList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.rateSubTypeList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              if (z.ListItem.toLowerCase() === this.billType.toLowerCase()) {
                this.selectedRateSubType = z.ListItem
              }
              this.rateSubTypeList.push(z.ListItem)
            }
          });
          this.selectedRateSubType = this.selectedRateSubType.toLowerCase() === this.billType.toLowerCase() ? this.selectedRateSubType : this.rateSubTypeList[0];
          this.loadRateListByRateTypeAndRateSubType();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  rateList: BillItemRateDetail[] = [];
  loadRateListByRateTypeAndRateSubType() {
    this._billServices.getRateListByRateTypeRateSubType(this.selectedRateType, this.selectedRateSubType).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.rateList = [];
          this.rateList = res.dataSet.Table;
          this.filterItemRateByName();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  billItemCharge: BillItemCharge = new BillItemCharge();
  saveBillItem() {
    // this.billItemCharge.BillNo = this.billDetail.BillNo.toString();
    // this.billItemCharge.SeqNo = this.billItemDetails.length.toString();
    // this._billServices.saveBillItemCharges(this.billItemCharge).subscribe(
    //   (res: Response) => {
    //     console.log(res);
    //     if (res.Status.toLowerCase().includes('success')) {
    //       this.loadBillItemDetailsByBillId(this.billDetail.BillNo);
    //       let _ele = document.getElementById('addChargeWithUnitNoteHide')?.click();
    //     }
    //     if (res.Status.toLowerCase().includes('failed')) {
    //       this.loadBillItemDetailsByBillId(this.billDetail.BillNo);
    //       let _ele = document.getElementById('addChargeWithUnitNoteHide')?.click();
    //     }
    //   }, (err: Error) => {
    //     console.error(err);
    //     alert('Please check log, for more detail.')
    //   }
    // )
  }

  setSelectedBillItemChargeDetail(_itemDetail: BillItemRateDetail) {
    this.billItemCharge.HeadDesc = _itemDetail.ItemDesc;
    this.billItemCharge.Code = _itemDetail.ItemCode;
    this.billItemCharge.Rate = _itemDetail.Rate.toString();
    this.billItemCharge.Amount = _itemDetail.Rate.toString();
    this.billItemCharge.RateId = _itemDetail.RateId.toString();
  }

  calculateFinalRateAmount() {
    this.billItemCharge.Amount = (Number(this.billItemCharge.Unit) * Number(this.billItemCharge.Rate)).toString();
  }

  selectedDeletingBillItemId: number = 0;
  reasonForDeleteBillItemDetail: string = '';

  deleteEntryByBillReceipt(){
    if(this.value.toLowerCase().includes('bill')){
      this.deleteBillItemByBillItemIdBillNo()
    }
    if(this.value.toLowerCase().includes('receipt')){
      this.deleteBillIReceiptByBillReceiptIdBillNo()
    }
  }

  deleteBillItemByBillItemIdBillNo() {
    if (this.reasonForDeleteBillItemDetail) {
      this._billServices.deleteBillItem(this.selectedDeletingBillItemId, this.billDetail.BillNo, this.reasonForDeleteBillItemDetail).subscribe(
        (res: Response) => {
          console.log(res);
          document.getElementById('reasonForDeleteBillItemHide')?.click();
          this.reasonForDeleteBillItemDetail = ''
          if (res.Status.toLowerCase().includes('success')) {
            this.loadBillDetailsByBillId(this.billDetail.BillNo);
          }
          if (res.Status.toLowerCase().includes('failed')) {
            this.loadBillDetailsByBillId(this.billDetail.BillNo);
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more detail.');
          document.getElementById('reasonForDeleteBillItemHide')?.click();
          this.reasonForDeleteBillItemDetail = ''
        }
      )
    } else {
      alert('Please add reason for delete?');
      document.getElementById('reasonForDeleteBillItemInput')?.focus()
    }
  }

  deleteBillIReceiptByBillReceiptIdBillNo() {
    if (this.reasonForDeleteBillItemDetail) {
      this._billServices.deleteBillReceipt(this.selectedDeletingBillItemId, this.billDetail.BillNo, this.reasonForDeleteBillItemDetail).subscribe(
        (res: Response) => {
          console.log(res);
          document.getElementById('reasonForDeleteBillItemHide')?.click();
          this.reasonForDeleteBillItemDetail = ''
          if (res.Status.toLowerCase().includes('success')) {
            this.loadBillDetailsByBillId(this.billDetail.BillNo);
          }
          if (res.Status.toLowerCase().includes('failed')) {
            this.loadBillDetailsByBillId(this.billDetail.BillNo);
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more detail.');
          document.getElementById('reasonForDeleteBillItemHide')?.click();
          this.reasonForDeleteBillItemDetail = ''
        }
      )
    } else {
      alert('Please add reason for delete?');
      document.getElementById('reasonForDeleteBillItemInput')?.focus()
    }
  }

  testList = [];
  loadPathLabTestList() {
    this._billServices.getPathTestList().subscribe(
      (res: Response) => {
        console.log(res);
        debugger
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.testList = [];
          this.testList = res.dataSet.Table;
        }
        this.filterItemRateByName();
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  filteredList: BillItemRateDetail[] = [];
  filterItemRateByName(_query?: string) {
    debugger
    let _filtered: BillItemRateDetail[] = [];

    if (this.billType.toLowerCase() === 'path') {
      if (_query && _query !== undefined) {
        if (this.testList.length) {
          this.testList.forEach(
            (z: PathTestDetail) => {
              if (z.TestName.toLowerCase().includes(_query.toLowerCase())) {
                let _z: BillItemRateDetail = new BillItemRateDetail();

                _z.ItemCode = z.PathTestId.toString();
                _z.ItemDesc = z.TestName.toString();
                _z.Provider = z.Remarks.toString();
                _z.Rate = Number(z.Amount);
                _z.RateId = z.PathTestId;
                _z.RoomType = z.PathLabid.toString();

                _filtered.push(_z);
              }
            }
          )
        } else {
          this.testList.forEach(
            (z: PathTestDetail) => {
              let _z: BillItemRateDetail = new BillItemRateDetail();

              _z.ItemCode = z.PathTestId.toString();
              _z.ItemDesc = z.TestName.toString();
              _z.Provider = z.Remarks.toString();
              _z.Rate = Number(z.Amount);
              _z.RateId = z.PathTestId;
              _z.RoomType = z.PathLabid.toString();

              _filtered.push(_z);
            }
          )
        }
      } else {
        this.testList.forEach(
          (z: PathTestDetail) => {
            let _z: BillItemRateDetail = new BillItemRateDetail();

            _z.ItemCode = z.PathTestId.toString();
            _z.ItemDesc = z.TestName.toString();
            _z.Provider = z.Remarks.toString();
            _z.Rate = Number(z.Amount);
            _z.RateId = z.PathTestId;
            _z.RoomType = z.PathLabid.toString();

            _filtered.push(_z);
          }
        )
      }
    } else {
      if (_query && _query !== undefined) {
        if (this.rateList.length) {
          this.rateList.forEach(
            (z: BillItemRateDetail) => {
              if (z.ItemDesc.toLowerCase().includes(_query.toLowerCase())) {
                _filtered.push(z);
              }
            }
          )
        } else {
          _filtered = this.rateList;
        }
      } else {
        _filtered = this.rateList;
      }
    }

    this.filteredList = _filtered;

  }

}
