import { TestBed } from '@angular/core/testing';

import { PatientManagementService } from './patient-management.service';

describe('PatientManagementService', () => {
  let service: PatientManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
