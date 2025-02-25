import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/shared/modules/prime-ng.module';

@Component({
  selector: 'app-operate-category',
  imports: [],
  providers: [PrimeNgModule],
  templateUrl: './operate-category.component.html',
  styleUrl: './operate-category.component.css'
})
export class OperateCategoryComponent {

  constructor(
    private _router: Router
  ) { }

  route(_dep: string) {
    this._router.navigate(['feature/' + _dep]);
  }

}
