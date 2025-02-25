import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { SessionService } from 'src/app/@core/services/session.service';
import { UserService } from 'src/app/@core/services/user.service';
import { Response } from 'src/app/shared/modals/response';
import { SessionDetails } from 'src/app/shared/modals/sessionDetail';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { environment } from 'src/environments/environment';

class LoginDetails {
  LoginName: string = '';
  pass1: string = '';
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _sessionService: SessionService,
    private _router: Router,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.hospitalName = environment.hospitalName;
    this.verifyLogin()
    this.getUserLoginNameList()
    this.screenHeight = environment.screenHeight.toString() + 'px';
    this.screenWidth = environment.screenWidth.toString() + 'px';
  }

  screenHeight: string = '';
  screenWidth: string = '';
  userName: string = '';
  inProcess: boolean = false;
  isSuccess: boolean = false;
  hospitalName:string = '';

  validateLogin() {
    if (this.loginDetails.LoginName && this.loginDetails.pass1) {
      this.inProcess = true;
      //debugger
      console.log(this.loginDetails);
      // this._commonService.activeLoader();
      this._authService.login(this.loginDetails).subscribe(
        (res: any) => {
          console.log(res);
          // this._commonService.deactiveLoader();
          if (res) {
            //debugger
            if (res.UserId > 0) {
              let _userSession: SessionDetails = new SessionDetails();
              _userSession.UserId = res.UserId;
              _userSession.UserName = res.UserName;
              this.userName = res.UserName;
              _userSession.UserRole = res.Role;
              setTimeout(() => {
                this.inProcess = false;
                this.isSuccess = true;
                setTimeout(() => {
                  this._sessionService.setSession(_userSession);
                  this._router.navigate(['auth/operate-category'])
                }, 1500);
              }, 2500);
            } else {

            }
          } else {
            alert('Please retry to login or check log for more detail.')
          }
        }, (err: Error) => {
          // this._commonService.deactiveLoader();
          console.error(err);
          this.inProcess = false;
          this.isSuccess = false;
          alert('Please check log, for more details.')
        }
      )

    } else {

    }
  }

  loginUserList: any[] = [];
  loginDetails: LoginDetails = new LoginDetails()
  getUserLoginNameList() {
    this._commonService.activeLoader();
    this._userService.getUserListWithOnlyLoginName().subscribe(
      (res: Response) => {
        this._commonService.deactiveLoader();
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          console.log(res);
          this.loginUserList = [];
          this.loginUserList = res.dataSet.Table;
          console.log(this.loginUserList);
        }
      }, (err: Error) => {
        this._commonService.deactiveLoader();
        console.error(err);
      }
    )
  }

  validPlatform(_query: string) {
    return this._commonService.checkPlatform(_query);
  }


  verifyLogin() {
    let _user = this._commonService.getCurrentSessionUserId();
    if (_user) {
      //debugger
      // let _previousTab =  document.referrer;
      // console.log(_previousTab);
      window.history.forward();
    }
  }



}
