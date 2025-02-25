import { TestBed } from '@angular/core/testing';

import { PrintManagementService } from './print-management.service';

describe('PrintManagementService', () => {
  let service: PrintManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
