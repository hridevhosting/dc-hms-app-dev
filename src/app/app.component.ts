import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './@core/services/auth.service';
import { CommonService } from './@core/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, DoCheck {
  // @ViewChild('op') op!: Popover;
  constructor(
    private _authService: AuthService,
    private _commonService: CommonService
  ) { }

  isPlatformAppleIos: boolean = false;
  ngOnInit(): void {
    this.platformName = this._commonService.getPlatformName(environment.currentUsingPlatform);
    this.isPlatformAppleIos = this.platformName.toLowerCase().includes('iphone');
    console.log(this.platformName);
    this.getLocalIP();
  }

  ngDoCheck(): void {
    this.setDeviceScreenHeightWidth();
    this.getScreenHeightWidthDetails();
    this.isSessionActive = this._authService.validateUserSession();
    this.isLoading = this._commonService.isLoading;
  }
  title = 'hms-web-app';
  isLoading: boolean = false;
  platformName: string = ''
  setDeviceScreenHeightWidth() {
    // environment.screenHeight = screen.height;
    // environment.screenWidth = screen.width;

    environment.screenHeight = window.innerHeight;
    environment.screenWidth = window.innerWidth;

    // console.log(environment);
  }

  screenHeight: string = 'auto';
  screenWidth: string = 'auto';
  isSessionActive: boolean = false;
  getScreenHeightWidthDetails() {
    this.screenHeight = environment.screenHeight.toString() + 'px';
    this.screenWidth = environment.screenWidth.toString() + 'px';
  }

  validAccessableDevices() {
    //debugger
    let _res: boolean = false;

    for (let device of environment.accessablePlatforms) {
      if (this.platformName.toLowerCase().includes(device.toLowerCase())) {
        _res = true;
      }
    }
    return _res
  }

  getLocalIP() {
    console.log(window);
    const pc = new RTCPeerConnection();
    pc.createDataChannel('');
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(error => console.error('Error creating offer:', error));

    pc.onicecandidate = (ice) => {
      if (ice && ice.candidate && ice.candidate.candidate) {
        const ipMatch = ice.candidate.candidate.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        if (ipMatch) {
          console.log('Your local IP address is:', ipMatch[0]);
        }
        pc.onicecandidate = null; // Prevent multiple calls
      }
    };
  }

  // getLocalIP((ip) => );

  getPrinterList() {
    // var oShell = new ActiveXObject("WScript.Shell");
    // sRegVal = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\Device';

    // var sName = oShell.RegRead(sRegVal)
    // if (sName == '') {
    //   alert('Please, Check the Default Printer');
    // }
    // document.getElementById("hdnResultValue").value = sName;
    // return sName;
  }


}
