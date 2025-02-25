import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/@core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  standalone: false,
  // imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [MessageService]
})
export class HeaderComponent implements OnInit, DoCheck {
  items: MenuItem[] = [];
  linkItems: MenuItem[] = [];

  constructor(
    private messageService: MessageService,
    private _router: Router,
    private _authService: AuthService

  ) { }

  ngOnInit() {
    this.screenWidth = environment.screenWidth || 0
    this.items = [
      {
        label: 'Personal Details',
        command: () => {
          this._router.navigate(['personal-details']);
        }
      },
      {
        label: 'Log Out',
        command: () => {
          this.logout();
        }
      }
    ]
    this.linkItems = [
      {
        label: 'Visit our site',
        command: () => {
          window.location.href = 'http://www.doctorscloud.in/';
        }
      },
      // {
      //   label: 'Provide Feedback',
      //   command: () => {
      //     window.location.href = 'https://www.google.com/search?q=doctorscloud&sca_esv=45ee99042305f18a&sxsrf=ADLYWILdecn_dtALdhy7gjUtsStyiFL8_Q%3A1720422160979&source=hp&ei=EI-LZqbKNqiXseMPsdeC4Ac&iflsig=AL9hbdgAAAAAZoudIOg1488L-QDWuLQ8eQUkuIotVdL1&oq=doct&gs_lp=Egdnd3Mtd2l6IgRkb2N0KgIIADIKECMYgAQYJxiKBTIEECMYJzILEAAYgAQYkQIYigUyDhAAGIAEGJECGLEDGIoFMgsQLhiABBixAxjUAjILEC4YgAQYsQMYgwEyCBAAGIAEGLEDMggQLhiABBixAzILEC4YgAQYsQMYgwEyCBAAGIAEGLEDSMsJUABYgQNwAHgAkAEAmAGYAaABuwSqAQMwLjS4AQPIAQD4AQGYAgSgAtIEwgILEAAYgAQYsQMYgwHCAhEQLhiABBixAxjRAxiDARjHAcICDhAuGIAEGLEDGIMBGIoFwgINEAAYgAQYsQMYFBiHApgDAJIHAzAuNKAHszQ&sclient=gws-wiz#';
      //   }
      // },
      {
        label: 'Head Office',
        command: () => {
          window.location.href = 'https://www.google.com/maps/dir//doctorscloud/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3bd4bf4155555555:0x6ac30e3352a1695a?sa=X&ved=1t:3061&ictx=111';
        }
      },
      {
        label: 'Contact Us',
        command: () => {
          window.location.href = 'tel:+918956108255'
        }
      },
      {
        label: 'Mail Us',
        command: () => {
          window.location.href = 'mailto:info@doctorscloud.in'
        }
      }
    ]
  }
  screenWidth: number = 0
  navigateScreenName: string = '';
  ngDoCheck(): void {
    this.navigateScreenName = environment.navigatedScreenName || '';
  }

  update() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
  }

  delete() {
    this.messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
  }

  isShowSideBar: boolean = false;

  showHideSidebar() {
    this.isShowSideBar = !this.isShowSideBar;
  }

  logout() {
    this._authService.logout();
  }

}
