import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { DevResIdentifyDirective } from 'src/app/shared/others/dev-res-identify.directive';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    DevResIdentifyDirective,
    PrimeNgModule
  ],
  providers: [PrimeNgModule]
})
export class LoginModule { }
