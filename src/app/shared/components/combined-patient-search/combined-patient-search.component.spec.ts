import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedPatientSearchComponent } from './combined-patient-search.component';

describe('CombinedPatientSearchComponent', () => {
  let component: CombinedPatientSearchComponent;
  let fixture: ComponentFixture<CombinedPatientSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombinedPatientSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedPatientSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
