import { TestBed } from '@angular/core/testing';

import { ReportCollectionManagementService } from './report-collection-management.service';

describe('ReportCollectionManagementService', () => {
  let service: ReportCollectionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportCollectionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
