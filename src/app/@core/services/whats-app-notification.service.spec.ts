import { TestBed } from '@angular/core/testing';

import { WhatsAppNotificationService } from './whats-app-notification.service';

describe('WhatsAppNotificationService', () => {
  let service: WhatsAppNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsAppNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
