import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { AttributeSetService } from 'src/app/@core/services/attribute-set.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { AttributeSet } from 'src/app/shared/modals/attribute-set';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
    selector: 'app-attribute-set',
    imports: [CommonModule, FormsModule, PrimeNgModule],
    templateUrl: './attribute-set.component.html',
    styleUrl: './attribute-set.component.css'
})
export class AttributeSetComponent implements OnInit {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private _attributeSetService: AttributeSetService,
    private _commonServices: CommonService,
    private _dialogConfig: DynamicDialogConfig,
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadAttributeSet();
    let _data = this._dialogConfig.data || null;
    console.log(_data);
    if (_data) {
      this.appointmentAdmissionId = _data.appointmentId || 0;
    }
    // this.items = [
    //   {
    //     label: 'Files',
    //     icon: 'pi pi-file',
    //     items: [
    //       {
    //         label: 'Documents',
    //         icon: 'pi pi-file',
    //         items: [
    //           {
    //             label: 'Invoices',
    //             icon: 'pi pi-file-pdf',
    //             items: [
    //               {
    //                 label: 'Pending',
    //                 icon: 'pi pi-stop'
    //               },
    //               {
    //                 label: 'Paid',
    //                 icon: 'pi pi-check-circle'
    //               }
    //             ]
    //           },
    //           {
    //             label: 'Clients',
    //             icon: 'pi pi-users'
    //           }
    //         ]
    //       },
    //       {
    //         label: 'Images',
    //         icon: 'pi pi-image',
    //         items: [
    //           {
    //             label: 'Logos',
    //             icon: 'pi pi-image'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Cloud',
    //     icon: 'pi pi-cloud',
    //     items: [
    //       {
    //         label: 'Upload',
    //         icon: 'pi pi-cloud-upload'
    //       },
    //       {
    //         label: 'Download',
    //         icon: 'pi pi-cloud-download'
    //       },
    //       {
    //         label: 'Sync',
    //         icon: 'pi pi-refresh'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Devices',
    //     icon: 'pi pi-desktop',
    //     items: [
    //       {
    //         label: 'Phone',
    //         icon: 'pi pi-mobile'
    //       },
    //       {
    //         label: 'Desktop',
    //         icon: 'pi pi-desktop'
    //       },
    //       {
    //         label: 'Tablet',
    //         icon: 'pi pi-tablet'
    //       }
    //     ]
    //   }
    // ]
    console.log(this.items);
  }

  attributeSetList: AttributeSet[] = [];
  items: MenuItem[] = [];

  loadAttributeSet() {
    this._commonServices.activeLoader()
    this._attributeSetService.getAttributeSet().subscribe(
      (res: Response) => {
        console.log(res);
        this._commonServices.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.attributeSetList = [];
          this.attributeSetList = res.dataSet.Table;
          this.filterAttributeItemList();
        }
      }, (err: Error) => {
        this._commonServices.deactiveLoader();
        console.error(err);
      }
    )
  }

  filterAttributeItemList() {
    let _list = null;
    _list = this.attributeSetList;

    let _titleList: string[] = [];
    //debugger
    if (_list.length && this.attributeSetList.length) {
      let _label = '';
      for (let i = 0; i < this.attributeSetList.length; i++) {
        //debugger
        if (i === 0) {
          _label = this.attributeSetList[i].Title;
          _titleList.push(_label);
        }
        if (_label.toLowerCase() !== this.attributeSetList[i].Title.toLowerCase()) {
          _label = this.attributeSetList[i].Title;
          _titleList.push(_label);
        }
      }
      //debugger
      for (let i = 0; i < _titleList.length; i++) {
        if (_titleList[i]) {
          let _param: MenuItem = {
            label: '',
            items: []
          }
          _param.label = _titleList[i].toUpperCase();
          this.items.push(_param);
          if (_titleList[i]) {
            for (let j = 0; j < this.attributeSetList.length; j++) {
              if (_titleList[i].toLowerCase() === this.attributeSetList[j].Title.toLowerCase()) {
                let _param1: MenuItem = {
                  label: '',
                  id: '',
                  badge: ''
                }
                _param1.label = this.attributeSetList[j].SetName.toUpperCase();
                _param1.id = this.attributeSetList[j].AttributeSetId.toString();
                _param1.badge = j.toString();
                if (_param1.id) {
                  this.items[i].items?.push(_param1);
                }
              }
            }
          }
        }
      }
      //debugger
      console.log(this.items);
    }
  }

  generateSet() {
    if (this.appointmentAdmissionId && this.selectedSetName) {
      this._attributeSetService.saveAttributeSet(this.appointmentAdmissionId, this.selectedSetName).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            window.document.location.reload();
          }
          if (res.Status.toLowerCase().includes('failed')) {
            window.document.location.reload();
          }
        }, (err: Error) => {
          console.error(err);
          alert('Please check log, for more detail.')
        }
      )
    } else {
      alert('Please provide proper set name & admission or appointment id.')
    }
  }

  appointmentAdmissionId: number = 0;
  selectedSetName: string = '';
  shoeSelectedAttribute(setName: string) {
    this.selectedSetName = '';
    this.selectedSetName = setName;
    console.log(this.selectedSetName);

  }

  showConfimPopUp(event: Event, setName:string) {
    this.selectedSetName = setName;
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to load this set ?',
      accept: () => {
        this.generateSet();
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

}
