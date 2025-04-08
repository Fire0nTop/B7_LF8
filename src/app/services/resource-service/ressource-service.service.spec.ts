import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ResourceServiceService', () => {
  let service: ResourceService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
    service = TestBed.inject(ResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
