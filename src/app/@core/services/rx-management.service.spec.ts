import { TestBed } from '@angular/core/testing';

import { RxManagementService } from './rx-management.service';

describe('RxManagementService', () => {
  let service: RxManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
