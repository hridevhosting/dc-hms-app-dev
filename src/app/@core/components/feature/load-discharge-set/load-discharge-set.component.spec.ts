import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDischargeSetComponent } from './load-discharge-set.component';

describe('LoadDischargeSetComponent', () => {
  let component: LoadDischargeSetComponent;
  let fixture: ComponentFixture<LoadDischargeSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadDischargeSetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDischargeSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
