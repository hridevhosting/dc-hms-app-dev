import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdManagementComponent } from './opd-management.component';

describe('OpdManagementComponent', () => {
  let component: OpdManagementComponent;
  let fixture: ComponentFixture<OpdManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpdManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpdManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
