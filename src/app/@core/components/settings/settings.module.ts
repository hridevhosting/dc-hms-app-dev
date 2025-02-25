import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SettingsComponent } from './settings.component';


@NgModule({
  declarations: [
    SidebarComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
