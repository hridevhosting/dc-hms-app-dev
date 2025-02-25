import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/@core/services/common.service';

@Directive({
  selector: '[appDoctorSisterNotes]'
})
export class DoctorSisterNotesDirective {

  @Input() appDoctorSisterNotes: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _commonServices: CommonService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    debugger
    if (changes['appDoctorSisterNotes']) {
      let _currentRole = this._commonServices.getCurrentSessionUserRole() || ''
      if(this.appDoctorSisterNotes && _currentRole && _currentRole.toLowerCase().includes(this.appDoctorSisterNotes)){
        this.display();
      }
    }
  }

  private display() {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
  }

}
