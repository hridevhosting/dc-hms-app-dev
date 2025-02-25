import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedAllocationManagementComponent } from './bed-allocation-management.component';

describe('BedAllocationManagementComponent', () => {
  let component: BedAllocationManagementComponent;
  let fixture: ComponentFixture<BedAllocationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedAllocationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedAllocationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
