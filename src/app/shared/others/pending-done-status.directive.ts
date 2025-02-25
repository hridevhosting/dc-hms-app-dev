import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appPendingDoneStatus]',
  standalone: true
})
export class PendingDoneStatusDirective {
  @Input() _value: string = '';

  constructor(
    private _el: ElementRef,
    // private _commonService: CommonService
  ) { }

  @HostBinding('statusCheck')
  checkStatus(event?: any) {
    //debugger
    // console.log('Trigger Directive');
    // console.log(event);

    // let _platform: string = this._commonService.getPlatformName(environment.currentUsingPlatform);
    // let _isMobileDev: boolean = _platform.toLowerCase().includes('iphone') ? true : false;
    // if (_isMobileDev) {
      // this._el.nativeElement.style.display = 'block';
    // } else {
      // this._el.nativeElement.style.display = 'none';
    // }

    console.log('Status Check');
    console.log(this._value);
    console.log(this._el);

  }

}
