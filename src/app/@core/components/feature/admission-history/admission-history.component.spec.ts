import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionHistoryComponent } from './admission-history.component';

describe('AddmissionHistoryComponent', () => {
  let component: AdmissionHistoryComponent;
  let fixture: ComponentFixture<AdmissionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
