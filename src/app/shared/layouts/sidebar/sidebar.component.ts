import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  // imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, DoCheck {
  @Input() sidebarVisible: boolean = false;
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private _router: Router,
    private _confirmationService: ConfirmationService
  ) { }
  ngDoCheck(): void {
    if (this.sidebarVisible) {
      this.getCurrentDateTime()
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');

    this.itemMenu = [
      {
        label: 'IPD',
        routerLink:'feature/ipd/dashboard'

      },
      {
        label: 'OPD',
        routerLink:'feature/opd'

      },
      {
        label: 'Reports Collection',
        routerLink:'feature/report-collection'

      },
      // {
      //   label: 'Reception',
      //    routerLink:'feature/reception'
      // },
      // {
      //   label: 'Wealth Check',
      //   command: () => { }
      // },
      // {
      //   label: 'Pathalogy',
      //   command: () => { }
      // }
    ]

  }

  itemMenu: MenuItem[] = []

  setSideMenuItems() {
    let _menuItem: MenuItem
  }

  currentDateTime: Date = new Date()

  getCurrentDateTime() {
    this.currentDateTime = new Date();
  }

  navigateByUrl(_url: string) {
    this._router.navigateByUrl(_url);
    this.sidebarVisible = false;
  }

  logOut(){
    sessionStorage.removeItem('user');
    window.document.location.reload();
  }

  showConfimPopUp(event: Event) {
    // this.selectedSetName = setName;
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure, you like to log out?',
      accept: () => {
        this.logOut();
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

}
