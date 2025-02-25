import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/@core/services/common.service';
import { List } from 'src/app/shared/modals/list';
import { Response } from 'src/app/shared/modals/response';

@Component({
    selector: 'app-common-list-item',
    imports: [CommonModule, FormsModule],
    templateUrl: './common-list-item.component.html',
    styleUrl: './common-list-item.component.css'
})
export class CommonListItemComponent implements OnInit {

  constructor(
    private _dialogConfig: DynamicDialogConfig,
    private _commonServices: CommonService
  ) { }

  ngOnInit(): void {
    let _data = this._dialogConfig.data || null;
    this.listDetail.ListItem = '';
    console.log(_data);
    if (_data) {
      this.listDetail.ListType = _data.listType
    }
  }

  listDetail: List = new List('');

  saveListDetail() {
    if (this.listDetail.ListType) {
      this._commonServices.saveListByListType(this.listDetail).subscribe(
        (res: Response) => {
          console.log("saveListByListType", res);
          if (res.Status.toLowerCase().includes('success') && res.Data) {

          }
        }, (err: Error) => {
          console.error("saveListByListType", err);
          alert('Please check log, for more detail.')
        }
      )
    } else {
      alert('Did`nt get List Type, Please try again.')
    }
  }

}
