import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { CommonListItemComponent } from '../common-list-item/common-list-item.component';
import { CommonService } from 'src/app/@core/services/common.service';
import { Response } from 'src/app/shared/modals/response';
import { List } from 'src/app/shared/modals/list';
import { BillReceipt } from 'src/app/shared/modals/bill-receipt';
import { BillManagementService } from 'src/app/@core/services/bill-management.service';
import { BillItemDetail } from 'src/app/shared/modals/bill-item-detail';

@Component({
    selector: 'app-bill-receipt',
    imports: [CommonModule, PrimeNgModule, FormsModule],
    providers: [DialogService],
    templateUrl: './bill-receipt.component.html',
    styleUrl: './bill-receipt.component.css'
})
export class BillReceiptComponent implements OnInit {

  constructor(
    private _dialogService: DialogService,
    private _commonServices: CommonService,
    private _dialogeConfig: DynamicDialogConfig,
    private _billManagementServices: BillManagementService
  ) { }

  ngOnInit(): void {

    this.billReceiptDetail.TranDate = this._commonServices.trasformDateTimeByFormat('yyyy-MM-dd') || '';
    this.billReceiptDetail.ChequeDate = this._commonServices.trasformDateTimeByFormat('yyyy-MM-dd') || '';

    console.log(this.billReceiptDetail);

    let _data = this._dialogeConfig.data || null;

    console.log(_data);
    if (_data) {
      this.billReceiptDetail.BillNo = _data.billNo || '';
      this.billType = _data.billType || '';
      this.loadBillItemDetailList();
      this.loadRecentReceiptNo();
    }

    this.loadPayerList();
    this.loadTpaList();
    this.loadPaymentModeList();

  }

  billReceiptDetail: BillReceipt = new BillReceipt()
  billType: string = '';

  showCommonListDialogeBox(listType: string) {
    let ref = this._dialogService.open(CommonListItemComponent, {
      header: listType.toUpperCase(),
      width: 'auto',
      position: 'bottom',
      data: {
        listType: listType,
        isNew: true,
        listData: null
      }
    })
  }

  payerList: string[] = [];
  loadPayerList() {
    this._commonServices.getPayerList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.payerList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              this.payerList.push(z.ListItem);
            }
          })
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  tpaList: string[] = [];
  loadTpaList() {
    this._commonServices.getTpaList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.tpaList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              this.tpaList.push(z.ListItem);
            }
          })
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  paymentModeList: string[] = [];
  loadPaymentModeList() {
    this._commonServices.getPaymentModeList().subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.paymentModeList = [];
          res.dataSet.Table.forEach((z: List) => {
            if (z.ListItem) {
              this.paymentModeList.push(z.ListItem);
            }
          })
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  saveBillReceiptDetail() {

    this._billManagementServices.saveReceiptDetail(this.billReceiptDetail).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.Data) {

        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )

  }

  onChangeShowDetail() {
    console.log(this.billReceiptDetail);
  }


  billItemList: BillItemDetail[] = [];
  loadBillItemDetailList() {
    this._billManagementServices.getBillItemDetailsByBillNo(Number(this.billReceiptDetail.BillNo)).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.billItemList = res.dataSet.Table
          console.log("billItemList", this.billItemList);
          this.loadReceiptListByBillId();
        }
      }, (err: Error) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  receiptList: BillReceipt[] = [];
  loadReceiptListByBillId() {
    this._billManagementServices.getRecieptListByBillId(this.billReceiptDetail.BillNo).subscribe(
      (res: Response) => {
        console.log("getRecieptListByBillId =>", res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.receiptList = [];
          this.receiptList = res.dataSet.Table;
        }
        this.calculatePatientGiven()
      }, (err: Error) => {
        console.error("getRecieptListByBillId =>", err);
        alert('Please check log, for more details');
      }
    )
  }

  patientGivenAmount: number = 0;
  calculatePatientGiven() {
    this.patientGivenAmount = 0;
    if (this.receiptList.length) {
      this.receiptList.forEach(
        (r: BillReceipt) => {
          this.patientGivenAmount = r.Receipts + this.patientGivenAmount;
        }
      )
      this.sortPaidUnPaid();
    }
  }

  showChargesList: boolean = false;
  addDeleteCharges(_item: BillItemDetail, isChecked: boolean) {
    // //debugger
    if (isChecked) {
      if (!this.billReceiptDetail.TranDesc) {
        this.billReceiptDetail.TranDesc = _item.HeadDesc;
        this.billReceiptDetail.Receipts = this.billReceiptDetail.Receipts + _item.Amount;
      } else {
        if (!this.billReceiptDetail.TranDesc.toLowerCase().includes(_item.HeadDesc.toLowerCase())) {
          if (!(this.billReceiptDetail.TranDesc.trim())[(this.billReceiptDetail.TranDesc.trim()).length - 1].includes(',')) {
            this.billReceiptDetail.TranDesc = this.billReceiptDetail.TranDesc + ', ' + _item.HeadDesc;
            this.billReceiptDetail.Receipts = this.billReceiptDetail.Receipts + _item.Amount;
          }
          if ((this.billReceiptDetail.TranDesc.trim())[(this.billReceiptDetail.TranDesc.trim()).length - 1].includes(',')) {
            this.billReceiptDetail.TranDesc = this.billReceiptDetail.TranDesc + _item.HeadDesc;
            this.billReceiptDetail.Receipts = this.billReceiptDetail.Receipts + _item.Amount;
          }
        }
      }
    } else {
      if (this.billReceiptDetail.TranDesc.toLowerCase().includes(_item.HeadDesc.toLowerCase())) {
        let _list = this.billReceiptDetail.TranDesc.split(',');
        if (_list.length) {
          for (let i = 0; i < _list.length; i++) {
            if (_list[i].toLowerCase().includes((_item.HeadDesc.toLowerCase()))) {
              _list[i] = ''
              this.billReceiptDetail.Receipts = this.billReceiptDetail.Receipts - _item.Amount;
            }
          }
          this.billReceiptDetail.TranDesc = ''
          for (let i = 0; i < _list.length; i++) {
            // //debugger
            if (_list[i]) {
              this.billReceiptDetail.TranDesc = this.billReceiptDetail.TranDesc + (this.billReceiptDetail.TranDesc ? ',' : '') + _list[i];
            }
          }

        }
      }
    }
  }

  paidItemList: any[] = [];
  sortPaidUnPaid() {
    let _chargedAmount = 0;
    _chargedAmount = this.patientGivenAmount;
    let _isLessThanAmountZero: boolean = false;
    if (this.receiptList.length) {
      for (let i = 0; i < this.billItemList.length; i++) {
        let _param: any = {
          isPaid: 0,
          balanceAmount: 0,
          data: null
        }
        if (this.billItemList[i].Amount && !this.billItemList[i].Code) {
          //debugger
          _chargedAmount = !_isLessThanAmountZero ? _chargedAmount - this.billItemList[i].Amount : 0;
          if (_chargedAmount < 0 || _isLessThanAmountZero) {
            _param.balanceAmount = !_isLessThanAmountZero ? _chargedAmount : 0;
            _param.data = this.billItemList[i];
            _isLessThanAmountZero = true;
          }
          if (_chargedAmount > 0 && !_isLessThanAmountZero) {
            _param.isPaid = 1;
            _param.data = this.billItemList[i];
          }
          if (_chargedAmount === 0 && !_isLessThanAmountZero) {
            _param.isPaid = 1;
            _param.data = this.billItemList[i];
          }
          this.paidItemList.push(_param);
        }
      }
      console.log(this.paidItemList);
    }
  }

  checkPaidUnPaid(_item: BillItemDetail) {
    //debugger
    let _res: string = 'Unpaid';
    if (this.paidItemList.length) {
      for (let i = 0; i < this.paidItemList.length; i++) {
        if (this.paidItemList[i].isPaid && this.paidItemList[i].data.BillDetailId === _item.BillDetailId) {
          _res = 'Paid';
        }
      }
    }
    return _res;
  }

  changeBgColorByPaidUnPaid(_id: string) {
    let _ele = document.getElementById(_id);
    let _innerText = _ele?.innerText || '';
    if (_innerText) {
      if (_innerText.toLowerCase() === 'paid') {
        return 'background-color: green; color: white;'
      }
      else {
        return 'background-color: red; color: white;'
      }
    } else {
      return 'background-color: red; color: white;'
    }
  }


  checkPaidUnpaid(_id: string) {
    let _ele = document.getElementById(_id);
    let _innerText = _ele?.innerText || '';
    if (_innerText) {
      if (_innerText.toLowerCase() === 'paid') {
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;
    }
  }

  saveReceiptDetailByBillNo() {
    console.log(this.billReceiptDetail);
    if (this.billReceiptDetail.BillReceiptId <= 0) {
      // this.billReceiptDetail.ReceiptNo =
    }
    // this._billManagementServices.saveReceiptDetailByBillNo(this.billReceiptDetail).subscribe(
    //   (res: Response) => {
    //     console.log(res);
    //     if (res.Status.toLowerCase().includes('success')) {

    //     }
    //     if (res.Status.toLowerCase().includes('failed')) {

    //     }
    //   }, (err: Error) => {
    //     console.error(err);
    //     alert('Please check log, for more detail.')
    //   }
    // )
  }

  validPlatform(_query: string) {
    return this._commonServices.checkPlatform(_query);
  }

  recentReceiptNo: string = '';
  loadRecentReceiptNo() {
    this._billManagementServices.getRecentReceiptNo(this.billType).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.recentReceiptNo = res.dataSet.Table[0].ReceiptNo || '';
          console.log(this.recentReceiptNo);
          this.configureNewReceiptNoBasedOnRecentReceiptNo()
        }
      }, (err: Error) => {
        console.error(err);
        // alert('Please check log')
      }
    )
  }

  configureNewReceiptNoBasedOnRecentReceiptNo() {
    let _no = 0;
    let _recentReceiptNoOnly: string = '';

    for (let i = 0; i < this.recentReceiptNo.length; i++) {
      if (this.recentReceiptNo[i] >= '0' && this.recentReceiptNo[i] <= '9' || this.recentReceiptNo[i] === '.') {
        if (this.recentReceiptNo[i - 1] >= '0' && this.recentReceiptNo[i - 1] <= '9' && (this.recentReceiptNo[i + 1] <= '9' || i === this.recentReceiptNo.length - 1)) {
          if (this.recentReceiptNo[i - 1] >= '0' && (this.recentReceiptNo[i + 1] <= '9' || i === this.recentReceiptNo.length - 1)) {
            _recentReceiptNoOnly = _recentReceiptNoOnly + this.recentReceiptNo[i];
          }
        } else {
          _recentReceiptNoOnly = _recentReceiptNoOnly + this.recentReceiptNo[i];
        }
      }
    }

    debugger
    if (this.billReceiptDetail.BillReceiptId <= 0 && !this.billReceiptDetail.ReceiptNo) {
      if (_recentReceiptNoOnly.includes('.')) {

        let _year = this._commonServices.trasformDateTimeByFormat('yy');
        let _month = this._commonServices.trasformDateTimeByFormat('MM');

        let _z = _recentReceiptNoOnly.split('.');
        let _digit = _z[_z.length - 1].length;
        let _oldNum = Number(_z[_z.length - 1]);
        let _newNum = _oldNum + 1;

        let _newNo = '0'

        let _preYearVal = ''
        let _preMonthVal = ''

        if (_z.length === 3) {
          if (_z[0] !== _year) {
            _preYearVal = _z[0];
            _z[0] = _year || _z[0];
          }
          if (_z[1] !== _month) {
            _preMonthVal = _z[1];
            _z[1] = _month || _z[1];
          }
        }


        if (_preYearVal || _preMonthVal) {
          for (let i = 0; i < _digit; i++) {
            if ((i + 1) === _digit) {
              _newNo = _newNo + '1';
            } else {
              _newNo = _newNo + '0';
            }
          }
        } else {
          for (let i = 0; i < _digit; i++) {
            if ((i) === (_digit - Number(_newNum.toString().length))) {
              _newNo = _newNo + _newNum.toString();
              if (_newNo.length === _digit.toString().length) {
                i = _digit.toString().length;
              }
            } else {
              _newNo = _newNo + '0';
            }
          }
        }

        _newNo = _z[0] + '.' + _z[1] + '.' + _newNo;
        console.log(_newNo);

        if (this.recentReceiptNo.includes('/')) {
          let _newReceiptNo = ''
          let _x = this.recentReceiptNo.split('/');

          for (let i = 0; i < _x.length; i++) {
            if ((i + 1) === _x.length) {
              _newReceiptNo = _newReceiptNo + '/' + _newNo;
            } else {
              _newReceiptNo = _newReceiptNo.length === 0 ? _x[i] : _newReceiptNo + '/' + _x[i];
            }
          }

          console.log(_newReceiptNo);

          this.billReceiptDetail.ReceiptNo = _newReceiptNo;

        }

      }

    }
    console.log(_recentReceiptNoOnly);

  }

}
