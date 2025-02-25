import { APP_INITIALIZER, ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule, platformBrowser } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimeNgModule } from './shared/modules/prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { SidebarComponent } from './shared/layouts/sidebar/sidebar.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DevResIdentifyDirective } from './shared/others/dev-res-identify.directive';
import { ConfirmationService } from 'primeng/api';

export function loadConfig() {
  // return console.log('App Started.');
  environment.screenHeight = window.innerHeight;
  environment.screenWidth = window.innerWidth;
  environment.currentUsingPlatform = window.navigator.platform;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PrimeNgModule,
    HttpClientModule,
    DevResIdentifyDirective,
  ],
  exports: [
    PrimeNgModule
  ],
  providers: [PrimeNgModule, DatePipe, ConfirmationService, { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      // multi: true
    }
  ],
  // bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private appRef: ApplicationRef) { }

  ngDoBootstrap() {
    // Manually bootstrap the app component
    this.appRef.bootstrap(AppComponent);
  }

}


