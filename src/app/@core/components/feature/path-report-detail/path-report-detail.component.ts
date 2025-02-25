import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BillManagementService } from 'src/app/@core/services/bill-management.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { PathManagementService } from 'src/app/@core/services/path-management.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { BillDetail } from 'src/app/shared/modals/bill-detail';
import { BillItemCharge } from 'src/app/shared/modals/bill-item-charge';
import { BillItemDetail } from 'src/app/shared/modals/bill-item-detail';
import { BillItemRateDetail } from 'src/app/shared/modals/bill-item-rate-detail';
import { List } from 'src/app/shared/modals/list';
import { PathTestDetail } from 'src/app/shared/modals/path-test-detail';
import { Patient } from 'src/app/shared/modals/Patient';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-path-report-detail',
    imports: [CommonModule, FormsModule, PrimeNgModule],
    providers: [DynamicDialogConfig],
    templateUrl: './path-report-detail.component.html',
    styleUrl: './path-report-detail.component.css'
})
export class PathReportDetailComponent implements OnInit {

  constructor(
    private _billServices: BillManagementService,
    private _dynamicDialoge: DynamicDialogConfig,
    private _commonServices: CommonService,
    private _patientServices: PatientManagementService,
    private _pathServices: PathManagementService
  ) { }

  ngOnInit(): void {
    //debugger
    let _data = this._dynamicDialoge.data;
    console.log(_data);
    console.log(this._dynamicDialoge);
    if (_data && _data !== undefined) {
      this.loadPatientDetailByPatientId(_data.ipdPatientDetail.EntityId);
    }
    console.log(history);
    if (!_data && _data === undefined) {
      this.loadPatientDetailByPatientId(history.state.patientId);
      this.caseDetail = history.state.caseDetail;
    }
    this.loadPathLabTestList();
    if (this.caseDetail) {
      this.loadPathTestListByPatientIdCaseId();
      this.loadPathTestDetailByPatientIdCaseId();
    }
  }

  billTypeList: string[] = [];
  billSubTypeList: string[] = [];
  selectedBillType: string = '';
  selectedBillSubType: string = '';
  caseDetail: any = null;
  loadRateTypeList() {
    this._billServices.getRateTypeList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.billTypeList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              this.billTypeList.push(z.ListItem)
            }
          });
          this.selectedBillType = this.billTypeList[0] || '';
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
          this.billSubTypeList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              if (z.ListItem.toLowerCase().includes('path')) {
                this.selectedBillSubType = z.ListItem || '';
              }
              this.billSubTypeList.push(z.ListItem)
            }
          });
          this.selectedBillSubType = this.selectedBillSubType.toLowerCase().includes('path') ? this.selectedBillSubType : this.billSubTypeList[0];
          this.loadRateListByRateTypeAndRateSubType();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  testList: PathTestDetail[] = [];
  loadRateListByRateTypeAndRateSubType() {
    console.log("Type =>", this.billTypeList);
    console.log("Sub Type=>", this.billSubTypeList);

    this._billServices.getRateListByRateTypeRateSubType(this.selectedBillType, this.selectedBillSubType).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.testList = [];
          this.testList = res.dataSet.Table;
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  selectedPathLabId: string = '';
  loadPathLabTestList() {
    this._billServices.getPathTestList(this.selectedPathLabId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.testList = [];
          this.testList = res.dataSet.Table;
          this.filterPathTest();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  filteredPathTestList: PathTestDetail[] = [];
  filterPathTest(_query?: string) {
    let _filtered: PathTestDetail[] = [];
    if (this.testList.length) {
      if (_query) {
        this.testList.forEach(
          (z: PathTestDetail) => {
            if (z.TestName.toLowerCase().includes(_query.toLowerCase())) {
              _filtered.push(z);
            }
          }
        )
        this.filteredPathTestList = _filtered;
      } else {
        this.filteredPathTestList = this.testList;
      }
    } else {
      alert('Please add path test, to get test list.')
    }
  }

  validPlatform(_query: string) {
    return this._commonServices.checkPlatform(_query);
  }

  patientDetail: Patient = new Patient();
  loadPatientDetailByPatientId(_patientId: number) {
    this._patientServices.getPatientDetailsByPatientId(_patientId).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success')) {
          this.patientDetail = new Patient();
          this.patientDetail = res.dataSet.Table[0];
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.');
      }
    )
  }

  pathTestList: BillItemDetail[] = []
  loadPathTestListByPatientIdCaseId() {
    if (this.caseDetail) {
      this._pathServices.getPathTestListByCaseIdAndPatientId(this.caseDetail.EntityId, this.caseDetail.AppointmentId).subscribe(
        (res: Response) => {
          console.log("Path Test List =>", res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            this.pathTestList = [];
            this.pathTestList = res.dataSet.Table;
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more detail.')
        }
      )
    } else {
      alert('Please check log, Unable to load path test list...');
    }
  }

  pathTestDetail: BillDetail = new BillDetail();
  loadPathTestDetailByPatientIdCaseId() {
    if (this.caseDetail) {
      this._pathServices.getPathTestDetailByCaseIdAndPatientId(this.caseDetail.EntityId, this.caseDetail.AppointmentId).subscribe(
        (res: Response) => {
          console.log("Path Test Detail =>", res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            this.pathTestDetail = new BillDetail();
            if (res.noofREcords === 1) {
              this.pathTestDetail = res.dataSet.Table[0];
            } else {
              alert('Found many entires for current appointment =>' + this.caseDetail.AppointmentId + ', patient =>' + this.caseDetail.EntityId);
            }
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more detail.')
        }
      )
    } else {
      alert('Please check log, Unable to load path test list...');
    }
  }

  billItemCharge: BillItemCharge = new BillItemCharge();

  calculateFinalRateAmount() {
    this.billItemCharge.Amount = (Number(this.billItemCharge.Unit) * Number(this.billItemCharge.Rate)).toString();
  }

  saveBillItem() {
    this.billItemCharge.BillNo = this.pathTestDetail.BillNo.toString();
    this.billItemCharge.SeqNo = this.pathTestList.length.toString();
    this._billServices.saveBillItemCharges(this.billItemCharge).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success')) {
          this.loadPathTestListByPatientIdCaseId();
          let _ele = document.getElementById('addChargeWithUnitNoteHide')?.click();
        }
        if (res.Status.toLowerCase().includes('failed')) {
          this.loadPathTestListByPatientIdCaseId();
          let _ele = document.getElementById('addChargeWithUnitNoteHide')?.click();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  setSelectedBillItemChargeDetail(_itemDetail: PathTestDetail) {
    this.billItemCharge.HeadDesc = _itemDetail.TestName;
    this.billItemCharge.Code = _itemDetail.PathTestId.toString();
    this.billItemCharge.Rate = _itemDetail.Amount.toString();
    this.billItemCharge.Amount = _itemDetail.Amount.toString();
    this.billItemCharge.RateId = _itemDetail.PathTestId.toString();
  }

  doubleClickMouseSavePathTest(_item: PathTestDetail) {
    this.setSelectedBillItemChargeDetail(_item);
    setTimeout(() => {
      this.saveBillItem();
    }, 500);
  }

  selectedDeletingBillItemId: number = 0;
  reasonForDeleteBillItemDetail: string = '';
  deleteBillItemByBillItemIdBillNo() {
    if (this.reasonForDeleteBillItemDetail) {
      this._billServices.deleteBillItem(this.selectedDeletingBillItemId, this.pathTestDetail.BillNo, this.reasonForDeleteBillItemDetail).subscribe(
        (res: Response) => {
          console.log(res);
          document.getElementById('reasonForDeleteBillItemHide')?.click();
          this.reasonForDeleteBillItemDetail = ''
          if (res.Status.toLowerCase().includes('success')) {
            this.loadPathTestListByPatientIdCaseId();
          }
          if (res.Status.toLowerCase().includes('failed')) {
            this.loadPathTestListByPatientIdCaseId();
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more detail.');
          // document.getElementById('reasonForDeleteBillItemHide')?.click();
          this.reasonForDeleteBillItemDetail = ''
        }
      )
    } else {
      alert('Please add reason for delete?');
      document.getElementById('reasonForDeleteBillItemInput')?.focus()
    }
  }


  stateOptions: any[] = [{ label: 'Requested', value: 'requested' }, { label: 'Tests', value: 'tests' }];
  value:string = 'requested'

}
