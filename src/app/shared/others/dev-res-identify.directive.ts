import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/@core/services/common.service';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[appDevResIdentify]',
  standalone: true
})
export class DevResIdentifyDirective implements OnChanges {
  @Input() _value: string = '';

  constructor(
    private _el: ElementRef,
    private _commonService: CommonService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_value']) {
      this.validDevice()
    }
  }

  @HostListener('')
  validDevice(event?: any) {
    //debugger
    console.log('Trigger Directive');
    console.log(event);

    let _platform: string = this._commonService.getPlatformName(environment.currentUsingPlatform);
    let _isMobileDev: boolean = _platform.toLowerCase().includes('iphone') ? true : false;
    if (_isMobileDev) {
      this._el.nativeElement.style.display = 'block';
    } else {
      this._el.nativeElement.style.display = 'none';
    }
  }

}
