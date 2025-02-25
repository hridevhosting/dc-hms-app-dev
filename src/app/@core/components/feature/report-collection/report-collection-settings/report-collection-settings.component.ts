import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportCollectionManagementService } from 'src/app/@core/services/report-collection-management.service';
import { UserService } from 'src/app/@core/services/user.service';
import { List } from 'src/app/shared/modals/list';
import { Response } from 'src/app/shared/modals/response';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

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

class UserDetail {
  UserId: number = 0;
  UserName: string = '';
}

@Component({
    selector: 'app-report-collection-settings',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeNgModule],
    templateUrl: './report-collection-settings.component.html',
    styleUrl: './report-collection-settings.component.css'
})
export class ReportCollectionSettingsComponent implements OnInit {

  constructor(
    private _reportServices: ReportCollectionManagementService,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUserList_UserIdUserName();
    this.resetAddUpdateMenuDetail();
    this.loadReportCollectionSideBarMenuList();
    console.log(this.addUpdateMenuDetail);
  }

  isMenuShow: boolean = true;
  isSubMenuShow: boolean = false;
  isMicroMenuShow: boolean = false;
  isMicroMenuTypeShow: boolean = false;
  isQueryShow: boolean = false;
  isAddUpdateMenu: boolean = false;
  isAddUpdateSubMenu: boolean = false;
  isDirectAddSubMenu: boolean = false;

  addUpdateMenuDetail: List = new List('report-collection-sidebar-main-menu');
  addUpdateSubMenuDetail: MenuAdditionalDetail = new MenuAdditionalDetail();

  resetAddUpdateMenuDetail() {
    this.addUpdateMenuDetail = new List('report-collection-sidebar-main-menu');
    this.addUpdateMenuDetail.ListParam = [];
    this.isAddUpdateSubMenu = false;
  }

  showingMenuName: string = 'menu';

  showSubMenuOptionByMenu() {
    this.showingMenuName = 'submenu'
  }


  showMicroMenuOptionByMenu() {
    this.showingMenuName = 'micromenu'
  }

  showMicroTypeMenuOptionByMenu() {
    this.showingMenuName = 'microtypemenu'
  }

  showQueryOptionBySubMenu() {
    this.isSubMenuShow = false;
    this.isMenuShow = false;
    this.isQueryShow = true;
    this.showingMenuName = 'query'
  }

  showAddUpdateMenu() {
    this.isSubMenuShow = false;
    this.isMenuShow = false;
    this.isQueryShow = false;
    this.isAddUpdateMenu = true;
  }

  returnBackOption() {
    if (this.isSubMenuShow) {
      this.isSubMenuShow = false;
      this.isMenuShow = true;
      this.isQueryShow = false;
    } else if (this.isQueryShow) {
      this.isSubMenuShow = true;
      this.isMenuShow = false;
      this.isQueryShow = false;
    } else {
      this.isSubMenuShow = false;
      this.isMenuShow = true;
      this.isQueryShow = false;
    }
  }

  addMicroMenuDetail() {
    this.addUpdateSubMenuDetail.subMenuArray.push(this.addMicroSubMenuDetail);
    this.addMicroSubMenuDetail = new SubMenuAdditionalDetail();
  }


  addMicroMenuTypeDetail() {
    this.addMicroSubMenuDetail.subMenuArray.push(this.addMicroSubMenuTypeDetail);
    this.addMicroSubMenuTypeDetail = new MenuSubAdditionalDetail();
  }

  addSubMenuDetail() {
    this.addUpdateMenuDetail.ListParam.push(this.addUpdateSubMenuDetail);
    this.addUpdateSubMenuDetail = new MenuAdditionalDetail();
  }

  addMicroSubMenuDetail: SubMenuAdditionalDetail = new SubMenuAdditionalDetail();
  addMicroSubMenuTypeDetail: MenuSubAdditionalDetail = new MenuSubAdditionalDetail();

  updateSubMenuDetail(_index: number) {
    if (typeof this.addUpdateMenuDetail.ListParam === 'object') {
      this.addUpdateSubMenuDetail = this.addUpdateMenuDetail.ListParam[_index];
    } else {
      this.convertStringToObject(this.updateSubMenuDetail, _index);
    }
  }

  userlist: UserDetail[] = [];

  loadUserList_UserIdUserName() {
    debugger
    this._userService.getUserListWithOnlyUserIdUserName().subscribe(
      (res: Response) => {
        console.log(res);
        if (res.noofREcords && res.Status.toLowerCase().trim().includes('success')) {
          this.userlist = [];
          this.userlist = res.dataSet.Table;
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        alert('Please check log, for more detail.')
      }
    )
  }

  verifyAddUpdateMenuDetailBeforeSaving() {
    debugger
    if (typeof this.addUpdateMenuDetail.ListParam === 'object') {
      if (this.addUpdateMenuDetail.ListParam.length) {
        this.addUpdateMenuDetail.ListParam = JSON.stringify(this.addUpdateMenuDetail.ListParam);
        this.saveMenuDetailWithSubMenuDetail();
      } else {
        alert('Please add sub menu before saving menu detail.')
      }
    } else {
      this.convertStringToObject(this.verifyAddUpdateMenuDetailBeforeSaving);
    }
  }

  saveMenuDetailWithSubMenuDetail() {
    this._reportServices.saveMenuWithSubMenuDetail(this.addUpdateMenuDetail).subscribe(
      (res: Response) => {
        console.log("saveMenuWithSubMenuDetail", res);
        if (res.Status.toLowerCase() === 'success') {
          this.resetAddUpdateMenuDetail();
          this.loadReportCollectionSideBarMenuList();
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  updateMenuDetailWithSubMenuDetail() {

    this.addUpdateMenuDetail = new List('');

    this.addUpdateMenuDetail = this.selectedMenu;

    if (this.addUpdateMenuDetail.ListParam && typeof this.addUpdateMenuDetail.ListParam === 'object') {
      this.addUpdateMenuDetail.ListParam = JSON.stringify(this.addUpdateMenuDetail.ListParam);
    }

    if (this.addUpdateMenuDetail.ListItemId > 0) {
      this.saveMenuDetailWithSubMenuDetail()
    } else {
      alert('Do you like to create new entry..!');
    }

  }

  convertStringToObject(_callBackFun: any, optionalValue?: any) {
    if (this.addUpdateMenuDetail.ListParam != null && this.addUpdateMenuDetail.ListParam != undefined && typeof this.addUpdateMenuDetail.ListParam === 'string') {
      if (this.addUpdateMenuDetail.ListParam.length > 0) {
        this.addUpdateMenuDetail.ListParam = JSON.parse(this.addUpdateMenuDetail.ListParam);
        if (optionalValue.toString()) {
          () => _callBackFun(optionalValue);
        } else {
          () => _callBackFun();
        }
      }
    }
  }

  reportCollectionSidebarMenuList: List[] = [];
  loadReportCollectionSideBarMenuList() {
    this._reportServices.getReportCollectionSidebarMenuList().subscribe(
      (res: Response) => {
        console.log("", res);
        if (res.Status.toLowerCase() === 'success' && res.noofREcords) {
          this.reportCollectionSidebarMenuList = [];
          this.reportCollectionSidebarMenuList = res.dataSet.Table;
          this.reportCollectionSidebarMenuList.forEach((z: List) => { z.ListParam.length ? z.ListParam = JSON.parse(z.ListParam) : null });
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  selectedMenu: List = new List('');
  selectedSubMenu: MenuAdditionalDetail = new MenuAdditionalDetail();
  selectedMicroMenu: SubMenuAdditionalDetail = new SubMenuAdditionalDetail();
  selectedMicroTypeMenu: MenuSubAdditionalDetail = new MenuSubAdditionalDetail();

  setSelectedMenuSubMenuList(_menuDetail: List) {
    debugger
    this.selectedMenu = new List('');
    this.selectedMenu = _menuDetail;
    this.showSubMenuOptionByMenu()
  }

  setSelectedSubMenuDetail(_subMenuDetail: MenuAdditionalDetail) {
    debugger
    this.selectedSubMenu = new MenuAdditionalDetail();
    this.selectedSubMenu = _subMenuDetail;
    this.showMicroMenuOptionByMenu()
  }

  setSelectedMicroMenuDetail(_subMenuDetail: SubMenuAdditionalDetail) {
    debugger
    this.selectedMicroMenu = new SubMenuAdditionalDetail();
    this.selectedMicroMenu = _subMenuDetail;
    this.showMicroTypeMenuOptionByMenu()
  }

  setSelectedMicroTypeMenuDetail(_subMenuDetail: MenuSubAdditionalDetail) {
    debugger
    this.selectedMicroTypeMenu = new MenuSubAdditionalDetail();
    this.selectedMicroTypeMenu = _subMenuDetail;
    this.showQueryOptionBySubMenu()
  }

  showList() {
    this.isMenuShow = true;
    this.isSubMenuShow = false;
    this.isQueryShow = false;
    this.isAddUpdateMenu = false;
    this.isAddUpdateSubMenu = false;
    this.isDirectAddSubMenu = false;
  }

  check_IsUserAdded(_userId: number) {
    let _res: boolean = false;
    if (this.addMicroSubMenuTypeDetail.userAccessList.length && _userId.toString()) {
      let _isPresent: boolean = false;
      for (let i = 0; i < this.addMicroSubMenuTypeDetail.userAccessList.length; i++) {
        if (this.addMicroSubMenuTypeDetail.userAccessList[i] === _userId) {
          _isPresent = true;
        }
      }
      _res = _isPresent;
    }

    return _res;
  }

  addDeleteUserAccess(_userId: number, _isChecked: boolean) {
    if (_isChecked) {
      this.addMicroSubMenuTypeDetail.userAccessList.push(_userId);
    } else {
      if (this.addMicroSubMenuTypeDetail.userAccessList.length) {
        let _index = '';
        for (let i = 0; i < this.addMicroSubMenuTypeDetail.userAccessList.length; i++) {
          if (this.addMicroSubMenuTypeDetail.userAccessList[i] === _userId) {
            _index = i.toString();
          }
        }
        if (_index) {
          this.addMicroSubMenuTypeDetail.userAccessList.splice(Number(_index), 1);
        }
      }
    }
  }

  setSubMenuList() {

  }

  setMicroMenuList() {

  }

  setMicroMenuTypeList() {

  }

}
