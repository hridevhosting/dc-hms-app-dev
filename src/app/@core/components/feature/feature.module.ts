import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';
import { PendingDoneStatusDirective } from 'src/app/shared/others/pending-done-status.directive';


@NgModule({
  declarations: [
    // PendingDoneStatusDirective
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ]
})
export class FeatureModule { }
