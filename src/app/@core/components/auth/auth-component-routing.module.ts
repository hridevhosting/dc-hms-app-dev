import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(login => login.LoginModule) },
  { path: 'sign-up', loadChildren: () => import('./sign-up/sign-up.module').then(signUp => signUp.SignUpModule) },
  { path: 'forget-password', loadComponent: () => import('./forget-password/forget-password.component').then(fp => fp.ForgetPasswordComponent) },
  { path: 'operate-category', canActivate: [authGuard], loadChildren: () => import('./operate-category/operate-category.module').then(operateCategory => operateCategory.OperateCategoryModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthComponentRoutingModule { }
