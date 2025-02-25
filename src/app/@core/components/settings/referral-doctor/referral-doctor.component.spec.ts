import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDoctorComponent } from './referral-doctor.component';

describe('ReferralDoctorComponent', () => {
  let component: ReferralDoctorComponent;
  let fixture: ComponentFixture<ReferralDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
