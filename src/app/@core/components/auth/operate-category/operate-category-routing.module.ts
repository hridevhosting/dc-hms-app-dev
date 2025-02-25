import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperateCategoryComponent } from './operate-category.component';

const routes: Routes = [
  { path: '', component: OperateCategoryComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperateCategoryRoutingModule { }
