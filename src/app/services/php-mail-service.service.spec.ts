import { TestBed } from '@angular/core/testing';

import { PhpMailServiceService } from './php-mail-service.service';

describe('PhpMailServiceService', () => {
  let service: PhpMailServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhpMailServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
