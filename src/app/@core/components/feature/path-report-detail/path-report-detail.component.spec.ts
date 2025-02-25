import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathReportDetailComponent } from './path-report-detail.component';

describe('PathReportDetailComponent', () => {
  let component: PathReportDetailComponent;
  let fixture: ComponentFixture<PathReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathReportDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
