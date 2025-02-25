import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PatientDetailsComponent } from "../../patient-details/patient-details.component";
import { PatientAppointmentComponent } from "../../patient-appointment/patient-appointment.component";
import { PatientAdmissionComponent } from '../../patient-admission/patient-admission.component';
import { DoctorSisterNotesDirective } from 'src/app/shared/others/doctor-sister-notes.directive';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PrimeNgModule,
    FormsModule,
    DoctorSisterNotesDirective,
    PatientDetailsComponent,
    PatientAdmissionComponent
],
  providers: [DialogService,DynamicDialogConfig]
})
export class DashboardModule { }
