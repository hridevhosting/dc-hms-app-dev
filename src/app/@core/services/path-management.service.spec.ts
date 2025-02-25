import { TestBed } from '@angular/core/testing';

import { PathManagementService } from './path-management.service';

describe('PathManagementService', () => {
  let service: PathManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
