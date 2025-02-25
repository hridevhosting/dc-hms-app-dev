import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from 'src/app/shared/modals/constant';
import { List } from 'src/app/shared/modals/list';
import { Request } from 'src/app/shared/modals/request';
import { Response } from 'src/app/shared/modals/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _datePipe: DatePipe,
    private _httpClient: HttpClient,
    private _dateTransform: DatePipe
    // private _translateLang: Translat
  ) { }

  _tempFailedMessage: string = 'System.IndexOutOfRangeException: Cannot find table 0.\r\n   at System.Data.DataTableCollection.get_Item(Int32 index)\r\n   at WebApplication1.Controllers.sqlController.nikHandler.MyHandler(Parameter param) in E:\\nik dev\\2017_12_14\\NikPharmacyWebApi\\Controllers\\sqlController.vb:line 77'

  generateApiRequestParam(controllerName: string, requestedJson?: any, query?: string) {
    let _request: Request = new Request();

    _request.Userid = this.getCurrentSessionUserId() ? this.getCurrentSessionUserId() : _request.Userid;
    _request.QueryType = controllerName;
    _request.inputJson = requestedJson ? requestedJson : null;
    _request.strQuery = query ? query : ''

    console.log(_request);
    return _request;
  }

  getCurrentSessionUserId() {
    //debugger
    let _userId: number = 0;
    let _user: any = null;
    _user = sessionStorage.getItem('user');
    _user ? _userId = JSON.parse(_user).UserId : _userId = 0;
    return _userId;
  }

  getCurrentSessionUserRole() {
    //debugger
    let _userRole: string = '';
    let _user: any = null;
    _user = sessionStorage.getItem('user');
    _user ? _userRole = JSON.parse(_user).UserRole : _userRole = '';
    return _userRole;
  }

  getCurrentSessionUserNameByUserRole(_role: string) {
    //debugger
    let _user: any = sessionStorage.getItem('user') || null;
    let _res = '';
    if (_user) {
      _user = JSON.parse(_user);
      _res = _user.UserRole.toLowerCase().includes(_role.toLowerCase()) ? _user.UserName : '';
    }
    return _res;
  }

  trasformDateTimeByFormat(_dateFormat?: string, _date?: any) {
    return this._datePipe.transform(_date || new Date(), _dateFormat || 'yyyy-MM-ddTHH:mm:ss');
  }

  trasformDateTimeBySpecialDatabaseFormat(_dateFormat?: string) {
    // return this._datePipe.transform(_date || new Date(), _dateFormat || 'yyyy-MM-ddTHH:mm:ss');

    // //debugger

    // let _date = this.trasformDateTimeByFormat() || '';

    // let _d: any = this.trasformDateTimeByFormat(_date, 'dd')
    // let _m: any = this.trasformDateTimeByFormat(_date, 'MMM');
    // let _y: any = this.trasformDateTimeByFormat(_date, 'yyyy')

    // let _hr: any = this.trasformDateTimeByFormat(_date, 'HH')
    // let _min: any = this.trasformDateTimeByFormat(_date, 'mm')
    // let _sec: any = this.trasformDateTimeByFormat(_date, 'ss')

    // _d = _d.toString().length == 1 ? '0' + _d : _d;
    // _m = _m.toString().length == 1 ? '0' + _m : _m;
    // _hr = _hr.toString().length == 1 ? '0' + _hr : _hr;
    // _min = _min.toString().length == 1 ? '0' + _min : _min;
    // _sec = _sec.toString().length == 1 ? '0' + _sec : _sec;

    return ``

  }

  calculateAgeByUserDOB(_dob: string) {

    let _userDob = new Date(_dob);

    let _year = _userDob.getFullYear();

    let _currentDate = new Date();

    let _currentYear = _currentDate.getFullYear();

    return _currentYear - _year;

  }

  isLoading: boolean = false;

  activeLoader() {
    this.isLoading = true;
  }

  deactiveLoader() {
    this.isLoading = false;
  }

  getPlatformName(_platformValue: string) {
    if (_platformValue.toLowerCase().includes('win32')) {
      return 'Microsoft Windows';
    } else if (_platformValue.toLowerCase().includes('linux')) {
      return 'Google Andriod';
    } else if (_platformValue.toLowerCase().includes('iphone')) {
      return 'Apple Iphone';
    } else if (_platformValue.toLowerCase().includes('ipad')) {
      return 'Apple Ipad';
    } else if (_platformValue.toLowerCase().includes('mac')) {
      return 'Apple MacOs';
    } else if (_platformValue.toLowerCase().includes('linux')) {
      return 'Linux OS';
    } else {
      return 'Unknown Platform';
    }
  }

  getRefrralDoctorList() {
    let _query = `select ListItemId, ListItem, Active from tblListItems where ListType like '%referraldoctor%' and active = 1`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getDoctorList() {
    let _query = `select UserName from tblUser where Role like 'doctor' and active = 1`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getMaritalStatusList() {
    let _query = `select * from tblListitems where listtype like 'Marital Status' and active = 1`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPayerList() {
    let _query = `select * from tblListitems where listtype like 'Payer' and active = 1`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPatientCategoryList() {
    let _query = `select * from tblListitems where listtype like 'PatientCategory' and active = 1`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getTpaList() {
    let _query = `select * from tblListitems where listtype like 'TPA' and active = 1`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  getPaymentModeList() {
    let _query = `select ListItem from tbllistitems where ListType='PaymentMode' and active=1 order by seqno;`;
    let _req = this.generateApiRequestParam(Constant.sqlFunNameList.select, null, _query);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.sqlController, _req);
  }

  saveListByListType(_listDetails: List) {
    let _req = this.generateApiRequestParam(Constant.commonList.saveDetails, _listDetails);
    return this._httpClient.post<Response>(Constant.apiUrl + Constant.listController, _req);
  }

  translateLangOneToAnotherLanguage(_data: string, from?: string, to?: string) {
    let _url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from || 'en'}&tl=${(to?.toLowerCase().includes('hi') ? to.split('-')[1] : 'hi') || 'hi'}&dt=t&q=${_data.replaceAll(' ', '%20')}`
    console.log(_url);
    return this._httpClient.get<any>(_url);
  }

  checkPlatform(_query: string) {
    let _platformValue = environment.currentUsingPlatform || '';
    // console.log(_platformValue);
    if (this.getPlatformName(_platformValue).toLowerCase().includes(_query.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  getHospitalSection() {
    return environment.hospitalSection || '';
  }

  setHospitalSection(screenName: string) {
    environment.navigatedScreenName = screenName
  }

  generateMonthWiseDate(selectedMonth?: number, selectedYear?: number, dateFormat?: string) {
    let year = selectedYear ? selectedYear : new Date().getFullYear();
    let month = selectedMonth ? selectedMonth - 1 : new Date().getMonth();
    var date = new Date(year, month);
    var days = [];
    while (date.getMonth() === month) {
      days.push(this._dateTransform.transform(new Date(date), dateFormat ? dateFormat : 'yyyy-MM-dd'));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  printHtmlInNewWindow(_htmlContent: string) {
    const printWindow = window.open('', 'Report', '0');
    let _html = _htmlContent;
    if (printWindow) {
      printWindow.document.write(_html);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window');
      alert('Failed to open print window');
    }
  }

  generateOTP(){
    return Math.floor(Math.random() * 900000) + 100000;
  }

}
