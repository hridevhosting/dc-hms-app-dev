import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'patient-details', pathMatch: 'full' },
  { path: 'ipd', canActivate: [authGuard], loadChildren: () => import('./../feature/ipd-management/ipd-management.module').then(ipd => ipd.IpdManagementModule) },
  { path: 'opd', canActivate: [authGuard], loadComponent: () => import('./../feature/opd-management/opd-management.component').then(opd => opd.OpdManagementComponent) },
  { path: 'reception', canActivate: [authGuard], loadComponent: () => import('./../feature/reception-management/reception-management.component').then(rm => rm.ReceptionManagementComponent) },
  { path: 'report-collection', canActivate: [authGuard], loadComponent: () => import('./../feature/report-collection/report-collection.component').then(rc => rc.ReportCollectionComponent) },
  { path: 'ipd/bill-management', canActivate: [authGuard], loadComponent: () => import('./../feature/billing-management/billing-management.component').then(billM => billM.BillingManagementComponent) },
  { path: 'opd/bill-management', canActivate: [authGuard], loadComponent: () => import('./../feature/billing-management/billing-management.component').then(billM => billM.BillingManagementComponent) },
  { path: 'ipd/path-summary', canActivate: [authGuard], loadComponent: () => import('./../feature/path-management/path-management.component').then(pathM => pathM.PathManagementComponent) },
  { path: 'opd/path-summary', canActivate: [authGuard], loadComponent: () => import('./../feature/path-management/path-management.component').then(pathM => pathM.PathManagementComponent) },
  { path: 'patient-details', canActivate: [authGuard], loadChildren: () => import('./../feature/patient-details/patient-details.module').then(patientDetails => patientDetails.PatientDetailsModule) },
  { path: 'opd/opd-card', canActivate: [authGuard], loadComponent: () => import('./../feature/discharge-summary/discharge-summary.component').then(opdCard => opdCard.DischargeSummaryComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
