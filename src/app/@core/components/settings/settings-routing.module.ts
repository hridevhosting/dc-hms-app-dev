import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralDoctorComponent } from './referral-doctor/referral-doctor.component';
import { SettingsComponent } from './settings.component';
import { AppVersionComponent } from './app-version/app-version.component';
import { CommonListComponent } from './common-list/common-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      {
        path: '', redirectTo: 'app-version', pathMatch: 'full'
      },
      {
        path: 'ref-doctor', loadComponent: () => import('./referral-doctor/referral-doctor.component').then(rds => rds.ReferralDoctorComponent)
      },
      {
        path: 'list/path-test', component: CommonListComponent
      },
      {
        path: 'list/bill-charges', component: CommonListComponent
      },
      {
        path: 'list/user', component: CommonListComponent
      },
      {
        path: 'list/patient', component: CommonListComponent
      },
      {
        path: 'reset-password', component: ResetPasswordComponent
      },
      {
        path: 'app-version', component: AppVersionComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
