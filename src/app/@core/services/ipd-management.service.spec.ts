import { TestBed } from '@angular/core/testing';

import { IpdManagementService } from './ipd-management.service';

describe('IpdManagementService', () => {
  let service: IpdManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpdManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
