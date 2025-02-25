import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { BillingManagementComponent } from '../billing-management/billing-management.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillManagementService } from 'src/app/@core/services/bill-management.service';
import { Response } from 'src/app/shared/modals/response';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { BillDetail } from 'src/app/shared/modals/bill-detail';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-billing-list',
    imports: [PrimeNgModule, CommonModule, FormsModule],
    providers: [DialogService, ConfirmationService],
    templateUrl: './billing-list.component.html',
    styleUrl: './billing-list.component.css'
})
export class BillingListComponent implements OnInit {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private _dialogService: DialogService,
    private _billManagementService: BillManagementService,
    private _dialogConfigService: DynamicDialogConfig,
    private _confirmationService: ConfirmationService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    let _res = this._dialogConfigService.data || null;
    console.log(_res);
    if (_res) {
      this.providedPatientId = _res.ipdPatientDetail.EntityId;
      this.providedAppointmentId = _res.ipdPatientDetail.AppointmentId;
      this.hospitalSection = _res.billType;
      this.loadBillListByPatientAndAppointmentId();
    }
  }

  visible: boolean = false
  isViewMode: boolean = false;
  showBillDialoge() {
    if (this.selectedBillDetail.BillNo > 0) {
      let ref = this._dialogService.open(BillingManagementComponent, {
        header: 'Bill Management',
        // closeOnEscape: true,
        // footer:'HeyHeyHey',
        width: 'auto',
        data: {
          billNo: this.selectedBillDetail.BillNo,
          billType: this.hospitalSection
        }
      })
    } else {
      alert('Please retry and select bill.')
    }
  }

  providedPatientId: number = 0;
  providedAppointmentId: number = 0;
  billList: BillDetail[] = [];
  selectedBillDetail: BillDetail = new BillDetail();
  hospitalSection: string = '';

  setSelectingBillDetail(billDetail: BillDetail) {
    if (billDetail.BillNo > 0) {
      this.selectedBillDetail = new BillDetail();
      this.selectedBillDetail = billDetail;
    }
  }

  setViewRadioValue(_value: boolean) {
    this.isViewMode = _value
    console.log(this.isViewMode);
  }

  loadBillListByPatientAndAppointmentId() {
    this._billManagementService.getBillListByPatientAndAppointmentId(this.providedPatientId, this.providedAppointmentId, this.hospitalSection).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.billList = [];
          this.billList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  showDeletePopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to delete bill ?',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  deleteBillByBillId() {

  }

  verifyViewEditMode() {
    if (!this.isViewMode) {
      this.navigateToBillManagement();
    } else {
      this.showBillDialoge()
    }
  }

  navigateToBillManagement() {
    //debugger

    let _hospitalSection = environment.hospitalSection || '';

    if (_hospitalSection) {
      if (_hospitalSection.toLowerCase().includes('opd')) {
        this._router.navigate(['feature/opd/bill-management'], { queryParams: { billId: this.selectedBillDetail.BillNo, caseId: this.providedAppointmentId, patientId: this.providedPatientId }, state: { hospitalSection: this.hospitalSection } })
        this._dialogService.dialogComponentRefMap.forEach(dialog => {
          dialog.destroy();
        });
      }
      if (_hospitalSection.toLowerCase().includes('ipd')) {
        this._router.navigate(['feature/ipd/bill-management'], { queryParams: { billId: this.selectedBillDetail.BillNo, caseId: this.providedAppointmentId, patientId: this.providedPatientId}, state: { hospitalSection: this.hospitalSection } })
        this._dialogService.dialogComponentRefMap.forEach(dialog => {
          dialog.destroy();
        });
      }
    } else {
      alert('Unable to fetch hospital section.');
    }
  }

}
