import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpdManagementRoutingModule } from './ipd-management-routing.module';
import { PatientAppointmentComponent } from '../patient-appointment/patient-appointment.component';
import { PatientDetailsComponent } from '../patient-details/patient-details.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IpdManagementRoutingModule,

  ]
})
export class IpdManagementModule { }
