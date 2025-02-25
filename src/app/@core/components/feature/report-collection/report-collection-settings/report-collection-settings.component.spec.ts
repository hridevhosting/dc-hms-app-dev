import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCollectionSettingsComponent } from './report-collection-settings.component';

describe('ReportCollectionSettingsComponent', () => {
  let component: ReportCollectionSettingsComponent;
  let fixture: ComponentFixture<ReportCollectionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCollectionSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCollectionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
