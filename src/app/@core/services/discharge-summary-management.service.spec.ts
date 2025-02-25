import { TestBed } from '@angular/core/testing';

import { DischargeSummaryManagementService } from './discharge-summary-management.service';

describe('DischargeSummaryManagementService', () => {
  let service: DischargeSummaryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DischargeSummaryManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
