import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let httpMock: HttpTestingController;
  const mockUrl = 'http://mock-api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DatabaseService,
        { provide: 'environment', useValue: { apiUrl: mockUrl } }
      ]
    });

    service = TestBed.inject(DatabaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
