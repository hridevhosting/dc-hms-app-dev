import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/@core/services/common.service';
import { UserService } from 'src/app/@core/services/user.service';
import { WhatsAppNotificationService } from 'src/app/@core/services/whats-app-notification.service';
import { Response } from 'src/app/shared/modals/response';
import { WhatsAppAlertMessage } from 'src/app/shared/modals/whats-app-alert-message';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {

  screenHW = {
    height: '',
    width: ''
  }

  constructor(
    private _whatsAppServices: WhatsAppNotificationService,
    private _commonServices: CommonService,
    private _userServices: UserService
  ) { }

  ngOnInit(): void {
    this.screenHW.height = window.innerHeight.toString();
    this.screenHW.width = window.innerWidth.toString();

    console.log(this.screenHW);

  }

  whatsAppAlertMsg: WhatsAppAlertMessage = new WhatsAppAlertMessage('reset_pwd_otp');

  resetWhatsAppVar() {
    this.whatsAppAlertMsg = new WhatsAppAlertMessage('reset_pwd_otp');
    this.whatsAppAlertMsg.AppointmentId = -1;
    this.whatsAppAlertMsg.EntityId = -1;
  }

  loadUserDetailByContactNo(_contactNo: string) {
    this._userServices.getUserDetailByContactNo(_contactNo).subscribe(
      (res: Response) => {
        if (res.Status.toLowerCase().trim().includes('success') && res.noofREcords) {
          this.whatsAppAlertMsg.id = res.dataSet.Table[0].UserId || 0;
          this.whatsAppAlertMsg.tableName = 'tblUser, Emp_Master';
          this.whatsAppAlertMsg.PersonName = (res.dataSet.Table[0].UserName || '').toUpperCase();
          if (this.whatsAppAlertMsg.id && this.whatsAppAlertMsg.PersonName) {
            this.sendWhatAppOTP_UserWhatsAppNumber();
          } else {
            alert('Please enter correct contact number.');
          }
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      }
    )
  }

  sendWhatAppOTP_UserWhatsAppNumber() {
    this.whatsAppAlertMsg.AppointmentId = this._commonServices.generateOTP();
    this.whatsAppAlertMsg.WhatsAppText = `
      Hello, ''.
      %0a %0a
      %0a %0a
      Your requested OTP is as follow,
      %0a %0a
      **.
      %0a %0a
      %0a %0a
      Valid for only 5min.
      %0a %0a
      %0a %0a
      *!IMPORTANT!*
      %0a %0a
      _*Please do not share any personal infomation to anyone, Your personal infomation is your responsibility.*_
    `;
    this.whatsAppAlertMsg.MobileNo = this.whatsAppAlertMsg.MobileNo.toString();
    this.whatsAppAlertMsg.SchDate = this._commonServices.trasformDateTimeByFormat() || '';
    // this.whatsAppAlertMsg.SentAt = this._commonServices.trasformDateTimeByFormat() || '';
    this._whatsAppServices.sendNotification(this.whatsAppAlertMsg.WhatsAppText, this.whatsAppAlertMsg.MobileNo).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {

        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      }
    )
    debugger
  }

}
