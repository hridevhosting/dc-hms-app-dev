import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/@core/services/common.service';
import { ReportCollectionManagementService } from 'src/app/@core/services/report-collection-management.service';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { ReportCollectionSettingsComponent } from './report-collection-settings/report-collection-settings.component';
import { List } from 'src/app/shared/modals/list';
import { from } from 'rxjs';

class ReportColumnName {
  columnName: string = '';
  columnKey: string = '';
}

class MenuAdditionalDetail {
  subMenuName: string = '';
  subMenuArray: SubMenuAdditionalDetail[] = []
}


class SubMenuAdditionalDetail {
  subMenuName: string = '';
  subMenuArray: MenuSubAdditionalDetail[] = []
}


class MenuSubAdditionalDetail {
  microMenuName: string = '';
  microMenuQuery: string = '';
  userAccessList: number[] = [];
}

class filterColumnName {
  columnName: string = '';
  columnValue: string = ''
}

@Component({
    selector: 'app-report-collection',
    imports: [CommonModule, PrimeNgModule, FormsModule],
    providers: [DialogService],
    templateUrl: './report-collection.component.html',
    styleUrl: './report-collection.component.css'
})
export class ReportCollectionComponent implements OnInit {

  constructor(
    private _reportServices: ReportCollectionManagementService,
    private _commonServices: CommonService,
    public _dialogService: DialogService
  ) { }

  items: MenuItem[] = [];
  items1: MenuItem[] = [];
  items2: MenuItem[] = [];

  representatives!: any[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];


  ngOnInit() {
    this.items = [
      {
        label: 'IPD',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Register',
            icon: 'pi pi-file',
            // items: [
            //   {
            //     label: 'Invoices',
            //     icon: 'pi pi-file-pdf',
            //     items: [
            //       {
            //         label: 'Pending',
            //         icon: 'pi pi-stop'
            //       },
            //       {
            //         label: 'Paid',
            //         icon: 'pi pi-check-circle'
            //       }
            //     ]
            //   },
            //   {
            //     label: 'Clients',
            //     icon: 'pi pi-users'
            //   }
            // ]
          },
          {
            label: 'Discharge Register',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          },
          {
            label: 'Cash Collection',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          },
          {
            label: 'Cash Deleted',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          }
        ]
      },
      {
        label: 'OPD',
        icon: 'pi pi-cloud',
        items: [
          {
            label: 'Register',
            icon: 'pi pi-file',
            // items: [
            //   {
            //     label: 'Invoices',
            //     icon: 'pi pi-file-pdf',
            //     items: [
            //       {
            //         label: 'Pending',
            //         icon: 'pi pi-stop'
            //       },
            //       {
            //         label: 'Paid',
            //         icon: 'pi pi-check-circle'
            //       }
            //     ]
            //   },
            //   {
            //     label: 'Clients',
            //     icon: 'pi pi-users'
            //   }
            // ]
          },
          {
            label: 'OPD Card',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          },
          {
            label: 'Cash Collection',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          },
          {
            label: 'Cash Deleted',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          }
        ]
      },
      {
        label: 'Pathalogy',
        icon: 'pi pi-desktop',
        items: [
          {
            label: 'Register',
            icon: 'pi pi-file',
            // items: [
            //   {
            //     label: 'Invoices',
            //     icon: 'pi pi-file-pdf',
            //     items: [
            //       {
            //         label: 'Pending',
            //         icon: 'pi pi-stop'
            //       },
            //       {
            //         label: 'Paid',
            //         icon: 'pi pi-check-circle'
            //       }
            //     ]
            //   },
            //   {
            //     label: 'Clients',
            //     icon: 'pi pi-users'
            //   }
            // ]
          },
          // {
          //   label: 'Discharge Register',
          //   icon: 'pi pi-image',
          //   // items: [
          //   //   {
          //   //     label: 'Logos',
          //   //     icon: 'pi pi-image'
          //   //   }
          //   // ]
          // },
          {
            label: 'Cash Received',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          },
          {
            label: 'Cash Deleted',
            icon: 'pi pi-image',
            // items: [
            //   {
            //     label: 'Logos',
            //     icon: 'pi pi-image'
            //   }
            // ]
          }
        ]
      }
    ];
    // this.items1 = [
    //   {
    //     label: 'MIS',
    //     icon: 'pi pi-file',
    //     items: [
    //       {
    //         label: 'Follow up patient',
    //         icon: 'pi pi-file',
    //       },
    //       {
    //         label: 'Doctor wise OT charge',
    //         icon: 'pi pi-image',
    //       },
    //       {
    //         label: 'Total section wise summary',
    //         icon: 'pi pi-image',
    //       },
    //       {
    //         label: 'Total section wise detailed summary',
    //         icon: 'pi pi-image',
    //       },
    //       {
    //         label: 'OT Schedule',
    //         icon: 'pi pi-image',
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Cash Summary',
    //     icon: 'pi pi-cloud',
    //     items: [
    //       {
    //         label: 'IPD',
    //         icon: 'pi pi-cloud-upload'
    //       },
    //       {
    //         label: 'OPD',
    //         icon: 'pi pi-cloud-download'
    //       },
    //       {
    //         label: 'Pathalogy',
    //         icon: 'pi pi-refresh'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Paitent Report',
    //     icon: 'pi pi-desktop',
    //     items: [
    //       {
    //         label: 'Admitted (IPD)',
    //         icon: 'pi pi-mobile',
    //         command: () => {
    //           this.setMainSectionSubSection('patientreport', 'admittedipd')
    //         }
    //       },
    //       {
    //         label: 'Check Up (OPD)',
    //         icon: 'pi pi-mobile',
    //         command: () => {
    //           this.setMainSectionSubSection('patientreport', 'checkupopd')
    //         }
    //       },
    //       {
    //         label: 'Discharged (IPD)',
    //         icon: 'pi pi-desktop'
    //       },
    //       {
    //         label: 'Current Date (IPD)',
    //         icon: 'pi pi-tablet'
    //       },
    //       {
    //         label: 'Current Date (OPD)',
    //         icon: 'pi pi-tablet'
    //       },
    //     ]
    //   },
    //   {
    //     label: 'Revenue Report',
    //     icon: 'pi pi-desktop',
    //     items: [
    //       {
    //         label: 'Revenue Sharing Report',
    //         icon: 'pi pi-mobile'
    //       },
    //     ]
    //   }
    // ];

    // this.items2 = [
    //   {
    //     label: 'Custom Report',
    //     icon: 'pi pi-desktop',
    //     items: [
    //       {
    //         label: 'Custom Report',
    //         icon: 'pi pi-mobile'
    //       },
    //     ]
    //   },
    // ]

    this.loadReportCollectionSideBarMenuList();

  }


  showReportCollectionSettingComponent() {
    let ref = this._dialogService.open(ReportCollectionSettingsComponent, {
      header: 'Report Collection Settings',
      width: '60%',
      height: '80%'
    })
  }

  reportItemList: any[] = [];


  commingSoon: string = 'assets/images/app-development.png';
  value: any = null;
  showCommingSoonBanner() {
    setTimeout(() => {
      if (this.commingSoon.toLowerCase().includes('app-development')) {
        this.commingSoon = 'assets/images/coming-soon.png'
      } else {
        this.commingSoon = 'assets/images/app-development.png'
      }
      this.showCommingSoonBanner();
    }, 2000);
  }

  mainSection: string = '';
  subSection: string = '';
  fromDate: string = '';
  toDate: string = '';
  currentCommand: any = null;

  setMainSectionSubSection(_mainSection: string, _subSection: string) {
    this.mainSection = _mainSection;
    this.subSection = _subSection;
    this.commandFunBasedonMainSectionSubSection();
  }

  commandFunBasedonMainSectionSubSection() {

    if (this.mainSection.toLowerCase() === 'patientreport' && this.subSection.toLowerCase() === 'admittedipd') {
      this.currentCommand = this.patientIPDAdmittedReport;
      let monthDayList = this._commonServices.generateMonthWiseDate();
      this.fromDate = monthDayList[0] || '';
      this.toDate = monthDayList[monthDayList.length - 1] || ''
      if (this.fromDate && this.toDate) {
        this.patientIPDAdmittedReport();
      } else {
        alert('Please try again!');
      }
    }

    if (this.mainSection.toLowerCase() === 'patientreport' && this.subSection.toLowerCase() === 'checkupopd') {
      this.currentCommand = this.patientIPDAdmittedReport;
      let monthDayList = this._commonServices.generateMonthWiseDate();
      this.fromDate = monthDayList[0] || '';
      this.toDate = monthDayList[monthDayList.length - 1] || ''
      if (this.fromDate && this.toDate) {
        this.patientCheckupOpdReport();
      } else {
        alert('Please try again!');
      }
    }

  }

  reportColumnNameList: ReportColumnName[] = [];
  sortReportColumnName() {
    debugger
    if (this.reportItemList.length) {
      this.reportColumnNameList = [];
      let object = Object.keys(this.reportItemList[0]);
      console.log(object);
      if (object.length) {
        object.forEach(
          (z: string) => {
            let _z = new ReportColumnName();
            _z.columnName = z;
            _z.columnKey = z;
          }
        )
      }
    }
  }

  patientIPDAdmittedReport() {
    console.log('Event Hit');
    console.log(this.fromDate);
    console.log(this.toDate);

    this._reportServices.getIpdAdmittedPatientList(this.fromDate, this.toDate).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.reportItemList = res.dataSet.Table;
          this.sortReportColumnName();
        }
      }, (err: Error) => {
        console.error(err);
      }
    )

  }

  patientCheckupOpdReport() {
    console.log('Event Hit');
    console.log(this.fromDate);
    console.log(this.toDate);

    this._reportServices.getOpdAdmittedPatientList(this.fromDate, this.toDate).subscribe(
      (res: Response) => {
        console.log(res);
        // if(){

        // }
      }, (err: Error) => {
        console.error(err);
      }
    )

  }

  reportCollectionSidebarMenuList: List[] = [];
  loadReportCollectionSideBarMenuList() {
    this._reportServices.getReportCollectionSidebarMenuList().subscribe(
      (res: Response) => {
        console.log("", res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          debugger
          this.reportCollectionSidebarMenuList = [];
          this.reportCollectionSidebarMenuList = res.dataSet.Table;
          this.reportCollectionSidebarMenuList.forEach((z: List) => { z.ListParam.length ? z.ListParam = JSON.parse(z.ListParam) : null });
          this.setSidebarItems()
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  setSidebarItems() {
    if (this.reportCollectionSidebarMenuList.length) {
      // debugger
      this.items = [];

      for (let i = 0; i < this.reportCollectionSidebarMenuList.length; i++) {
        // debugger
        let _z = this.reportCollectionSidebarMenuList[i];
        let _menuItem: MenuItem = [];
        _menuItem.label = _z.ListItem

        if (_z.ListParam.length) {
          // debugger
          let _subMenuList: MenuItem[] = [];

          for (let j = 0; j < _z.ListParam.length; j++) {
            // debugger
            let _subMenuDetail: MenuItem = [];
            let _z1: MenuAdditionalDetail = _z.ListParam[j];
            _subMenuDetail.label = _z1.subMenuName

            if (_z1.subMenuArray.length) {
              // debugger
              let _microMenuList: MenuItem[] = [];

              for (let k = 0; k < _z1.subMenuArray.length; k++) {
                // debugger
                let _microMenuDetail: MenuItem = []
                let _z2: SubMenuAdditionalDetail = _z1.subMenuArray[k];

                if (_z2.subMenuArray.length) {
                  // debugger

                  _microMenuDetail.label = _z2.subMenuName
                  let _microMenuTypeList: MenuItem[] = []

                  for (let l = 0; l < _z2.subMenuArray.length; l++) {
                    // debugger
                    let _microMenuTypeDetail: MenuItem = []
                    let _z3: MenuSubAdditionalDetail = _z2.subMenuArray[l];
                    _microMenuTypeDetail.label = _z3.microMenuName;
                    _microMenuTypeDetail.queryParams = {
                      query: _z3.microMenuQuery
                    }
                    _microMenuTypeDetail.command = () => this.setQuery(_z3.microMenuQuery);
                    _microMenuTypeDetail.queryParams = _z3.userAccessList
                    _microMenuTypeList.push(_microMenuTypeDetail);

                  }

                  _microMenuDetail.items = _microMenuTypeList;
                  _microMenuList.push(_microMenuDetail);
                }

              }

              _subMenuDetail.items = _microMenuList
              _subMenuList.push(_subMenuDetail);
            } else {

            }

          }
          _menuItem.items = _subMenuList
        }
        this.items.push(_menuItem);
      }
    }
  }

  selectedSubMenuQuery: string = ''

  setQuery(_query: string) {
    debugger
    this.selectedSubMenuQuery = _query;
    if (!this.fromDate && !this.toDate) {
      let monthDayList = this._commonServices.generateMonthWiseDate();
      this.fromDate = monthDayList[0] || '';
      this.toDate = monthDayList[monthDayList.length - 1] || ''
    }



    this.loadReportCollectionBySelectedSubMenuQuery()
  }


  loadReportCollectionBySelectedSubMenuQuery() {

    let _query = this.selectedSubMenuQuery;

    _query = _query.replace('[FromDate]', this.fromDate.toString());
    _query = _query.replace('[ToDate]', this.toDate.toString());

    console.log(_query);

    this._reportServices.getReportCollectionByQuery(_query).subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.reportItemList = [];
          this.reportItemList = res.dataSet.Table;
          this.sortColumnName();
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  filterColumnNameList: filterColumnName[] = [];
  sortColumnName() {
    if (this.reportItemList.length) {
      let _0 = Object.keys(this.reportItemList[0]);
      // debugger

      if (_0.length) {
        for (let i = 0; i < _0.length; i++) {

          let _array: string[] = this.splitByUppercase(_0[i]);
          let _columnNameValue: filterColumnName = new filterColumnName();

          if (_array.length) {
            _array = this.setNewUppercaseSplitedArray(_array)
            _columnNameValue.columnName = this.getColumnName_WithSpaceInBetweenWords(_array);
            _columnNameValue.columnValue = _0[i];
            this.filterColumnNameList.push(_columnNameValue);
          }
          // debugger
        }
      }
      console.log(this.filterColumnNameList);
    }
  }

  getColumnName_WithSpaceInBetweenWords(_stringArray: string[]) {
    let _res: string = '';
    if (_stringArray.length) {
      let _newString: string = ''
      for (let i = 0; i < _stringArray.length; i++) {
        _newString = _newString + ' ' + _stringArray[i];
      }
      if (_newString.length) {
        _res = _newString.trim()
      }
    }
    return _res
  }

  setNewUppercaseSplitedArray(_stringArray: string[]) {
    let _res: string[] = [];
    debugger
    if (_stringArray.length) {
      let _string = '';
      let _list: string[] = [];
      for (let i = 0; i < _stringArray.length; i++) {
        if (_stringArray[i].length === 1) {
          _string = _string + _stringArray[i];
        }
        if (_stringArray[i].length > 1) {
          if (_string.length > 0) {
            _list.push(_string);
            _string = '';
          }
          _list.push(_stringArray[i]);
        }
      }
      if (_list.length) {
        _res = _list
      }
    }
    return _res
  }

  splitByUppercase(_string: string) {
    const words = _string.split(/(?=[A-Z])/);
    return words;
  }


  checkLetterCase_IsInUpperCase(_letter: string) {
    return _letter === _letter.toUpperCase() ? true : false;
  }

  checkLetterCase_IsInLowerCase(_letter: string) {
    return _letter === _letter.toLowerCase() ? true : false;
  }

  validPlatform(_query: string) {
    return this._commonServices.checkPlatform(_query);
  }

}
