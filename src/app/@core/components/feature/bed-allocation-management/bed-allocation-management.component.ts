import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BedManagementService } from 'src/app/@core/services/bed-management.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { BedDetails } from 'src/app/shared/modals/bed-details';
import { BedType } from 'src/app/shared/modals/bed-type';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-bed-allocation-management',
    imports: [CommonModule, FormsModule, PrimeNgModule],
    providers: [DialogService, ConfirmationService],
    templateUrl: './bed-allocation-management.component.html',
    styleUrl: './bed-allocation-management.component.css'
})
export class BedAllocationManagementComponent implements OnInit {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private _bedServices: BedManagementService,
    private _commonService: CommonService,
    private _confirmationService: ConfirmationService,
    private _dialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this._commonService.trasformDateTimeBySpecialDatabaseFormat();
    // //debugger
    let data = this._dialogConfig.data;
    console.log(data);

    if (data) {
      this.admissionId = data.admissionId;
    }

    this.loadBedType();
  }


  unAllotedBedList: BedDetails[] = [];
  admissionId: number = 0;
  loadUnAllotedBedList() {
    this._bedServices.getUnAllotedBedList().subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.unAllotedBedList = [];
          this.unAllotedBedList = res.dataSet.Table;
          this.sortLocationType();
        }
      }, (err: Error) => {
        console.error(err);

      }
    )
  }

  bedTypeList: string[] = [];
  loadBedType() {
    this._bedServices.getBedTypeList().subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.bedTypeList = [];
          this.bedTypeList = res.dataSet.Table;
          this.loadUnAllotedBedList();
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  locationList: string[] = [];
  sortLocationType() {
    let _locationList: string[] = [];

    if (this.unAllotedBedList.length) {
      let _list = null;
      _list = this.unAllotedBedList;
      let _location = ''
      for (let i = 0; i < _list.length; i++) {
        //debugger
        let _isAvailable: boolean = false;
        _isAvailable = false;
        if (i === 0) {
          _locationList.push(_list[i].Location);
          _location = _list[i].Location;
        } else {
          _locationList.forEach(
            (list: string) => {
              if (list.toLowerCase() === _list[i].Location.toLowerCase()) {
                _isAvailable = true;
              }
            }
          )
          if (_location !== _list[i].Location && !_isAvailable) {
            _location = _list[i].Location;
            _locationList.push(_location);
          }
        }
      }
      this.locationList = _locationList;
      this.selectedBedType = '';
      this.selectedLocation = '';
      console.log(this.selectedBedType);
      console.log(this.selectedLocation);

      this.sortBedTypeByBedLocation();
      this.sortBedByLocationAndBedType();
    } else {

    }
  }

  sortBedTypeByBedLocation() {
    // //debugger

    let _typeList: any[] = [];

    this.unAllotedBedList.forEach(
      (z: BedDetails) => {
        // //debugger
        if (this.selectedLocation) {
          if (this.selectedLocation.toLowerCase() === z.Location.toLowerCase()) {
            _typeList.push(z.BedType);
          }
        } else {
          _typeList.push(z.BedType);
        }
      }
    )

    let _distinctList: string[] = [];

    if (_typeList.length) {
      // //debugger
      _typeList.forEach(
        (z: string) => {
          // //debugger
          if (_distinctList.length) {
            // //debugger
            let _isAvailable: boolean = false;
            _distinctList.forEach(
              (a: string) => {
                // //debugger
                if (z.toLowerCase() === a.toLowerCase()) {
                  _isAvailable = true;
                }
              }
            )
            if (!_isAvailable) {
              _distinctList.push(z);
            }
          } else {
            _distinctList.push(z);
          }
        }
      )
    }

    this.bedTypeList = _distinctList;

  }

  selectedLocation: string = '';
  selectedBedType: string = '';

  sortedBedList: BedDetails[] = [];
  sortBedByLocationAndBedType() {
    //debugger
    let _sortedList: BedDetails[] = [];
    this.unAllotedBedList.forEach(
      (bed: BedDetails) => {
        //debugger
        if (this.selectedBedType.toLowerCase() === bed.BedType.toLowerCase() && this.selectedLocation.toLowerCase() === bed.Location.toLowerCase()) {
          _sortedList.push(bed);
        }
        if (this.selectedBedType.toLowerCase() === bed.BedType.toLowerCase() && this.selectedLocation.toLowerCase() === '') {
          _sortedList.push(bed);
        }
      }
    )


    if (!_sortedList.length) {
      this.sortedBedList = this.unAllotedBedList;
    } else {
      this.sortedBedList = _sortedList;
    }


    console.log(this.sortedBedList);
  }

  showAllotementAlertPopUp(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to allote this bed ?',
      accept: () => {
        this.saveBedDetails();
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  filterBed() {
    this.sortBedTypeByBedLocation();
    this.sortBedByLocationAndBedType();
  }

  saveBedDetails() {
    if (this.selectedBedDetails.BedId > 0) {
      this._bedServices.updateBedAllocation(0, this.admissionId, this.selectedBedDetails.BedId, this.selectedBedDetails.Charges, this.selectedBedDetails.Location, this.selectedBedDetails.BedDesc, this.selectedBedDetails.BedType).subscribe(
        (res: Response) => {
          console.log(res);
          let _tempMsg = `System.IndexOutOfRangeException: Cannot find table 0.`
          if (res.Status.toLowerCase().includes('success')) {
            alert('Alloted Bed');
          } else {
            if (res.myError.includes(_tempMsg)) {
              alert('Alloted Bed');
            }
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more details.')
        }
      )
    } else {
      alert('Please select bed again.');
    }
  }

  selectedBedDetails: BedDetails = new BedDetails();


  validPlatform(_query: string) {
    return this._commonService.checkPlatform(_query);
  }


}
