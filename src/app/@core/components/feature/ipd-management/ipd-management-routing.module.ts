import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(dashboard => dashboard.DashboardModule) },
  { path: 'discharge-summary', loadComponent: () => import('./../discharge-summary/discharge-summary.component').then(discharge => discharge.DischargeSummaryComponent) },
  { path: 'path-summary', loadComponent: () => import('./../path-management/path-management.component').then(pathM => pathM.PathManagementComponent)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpdManagementRoutingModule { }
