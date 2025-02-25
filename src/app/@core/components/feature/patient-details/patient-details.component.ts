import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/@core/services/common.service';
import { PatientManagementService } from 'src/app/@core/services/patient-management.service';
import { List } from 'src/app/shared/modals/list';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-patient-details',
    imports: [PrimeNgModule, FormsModule],
    templateUrl: './patient-details.component.html',
    styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit, OnChanges {
  @Input() patientId: number = 0

  constructor(
    private _commonService: CommonService,
    private _dialogeConfig: DynamicDialogConfig,
    private _patientServices: PatientManagementService,
  ) { }

  ngOnInit(): void {
    let _data = this._dialogeConfig.data || null;
    if (_data) {
      console.log(_data);
      this.patientId = _data.patientId || 0;
      this.loadPatientDetailsByPatientId()
    }
    this.loadMaritalStatusList();
    this.loadPatientCategoryList();
    this.loadPayerList();
    this.loadTpaList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['patientId']){
      console.log(this.patientId);
      this.loadPatientDetailsByPatientId()
    }
  }

  maritalStatusList: List[] = [];
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
      console.log(this.listType);
      console.log(this.listDetail);
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


}
