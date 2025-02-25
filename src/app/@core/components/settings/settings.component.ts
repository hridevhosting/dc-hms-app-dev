import { Component, OnInit, } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {



  constructor(
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {

  }

  showSideBar: boolean = true;
  sidebarWidth: string = '';
  formWidth: string = '';

  validPlatform(_platformName: string) {
    return this._commonService.checkPlatform(_platformName)
  }

}
