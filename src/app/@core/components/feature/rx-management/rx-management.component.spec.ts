import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxManagementComponent } from './rx-management.component';

describe('RxManagementComponent', () => {
  let component: RxManagementComponent;
  let fixture: ComponentFixture<RxManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RxManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RxManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
