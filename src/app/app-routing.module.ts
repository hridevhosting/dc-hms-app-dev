import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './@core/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./@core/components/auth/auth-component.module').then(auth => auth.AuthComponentModule) },
  { path: 'feature', canActivate: [authGuard], loadChildren: () => import('./@core/components/feature/feature.module').then(feature => feature.FeatureModule) },
  { path: 'personal-details', canActivate: [authGuard], loadComponent: () => import('./@core/components/feature/personal-details/personal-details.component').then(personalDetails => personalDetails.PersonalDetailsComponent) },
  { path: 'settings', canActivate: [authGuard], loadChildren: () => import('./@core/components/settings/settings.module').then(setting => setting.SettingsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
