import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatabaseService } from './database.service';
import { Schiff, SchiffPosition, Spiel, Zug, Spieler } from '../models';

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

  describe('Schiff-Methoden', () => {
    it('should get all Schiffe', () => {
      service.getAllSchiffe().subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toContain('query=SELECT%20*%20FROM%20schiff%3B');
    });

    it('should create Schiff', () => {
      const testSchiff = new Schiff(
        1, 'TestSchiff', 5, 3, 2
      );

      service.createSchiff(testSchiff).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'INSERT%20INTO%20schiff%20(schiff_name%2C%20horizontal_groesse%2C%20vertikal_groesse%2C%20schiff_anzahl)'
      );
    });
  });

  describe('Spiel-Methoden', () => {
    it('should create new Spiel', () => {
      const testSpiel = new Spiel(1);
      service.createSpiel(testSpiel).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain('INSERT%20INTO%20spiel%20(spiel_id)%20VALUES%20(1)');
    });

    it('should get aktives Spiel', () => {
      service.getAktivesSpiel().subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'SELECT%20*%20FROM%20spiel%20ORDER%20BY%20spiel_id%20DESC%20LIMIT%201%3B'
      );
    });
  });

  describe('SchiffPosition-Methoden', () => {
    it('should set SchiffPosition', () => {
      const position = new SchiffPosition(
        1, 1, 1, 10, 15, false
      );

      service.setzeSchiffPosition(position).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'INSERT%20INTO%20schiff_position%20(schiff_id%2C%20spiel_id%2C%20position_x%2C%20position_y%2C%20zerst%C3%B6rt)'
      );
    });

    it('should mark Schiff als zerstört', () => {
      service.markiereSchiffAlsZerstoert(123).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'UPDATE%20schiff_position%20SET%20zerst%C3%B6rt%20%3D%201%20WHERE%20schiff_position_id%20%3D%20123'
      );
    });
  });

  describe('Zug-Methoden', () => {
    it('should save Zug', () => {
      const zug = new Zug(5, 5, true, 1, 123, 1);
      service.speichereZug(zug).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'INSERT%20INTO%20zug%20(kordinate_x%2C%20kordinate_y%2C%20treffer%2C%20runde%2C%20spieler%2C%20spiel_id)'
      );
    });
  });

  describe('Spieler-Methoden', () => {
    it('should registriere Spieler', () => {
      const spieler = new Spieler(1, 'TestUser');
      service.registriereSpieler(spieler).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'INSERT%20INTO%20spieler%20(spieler_id%2C%20user_name)%20VALUES%20(1%2C%20%27TestUser%27)'
      );
    });
  });

  describe('Spielstand-Methoden', () => {
    it('should get Spielstand', () => {
      service.getSpielstand(1).subscribe();

      const req = httpMock.expectOne(mockUrl);
      expect(req.request.body).toContain(
        'SELECT%20s.spiel_id%2C%20(SELECT%20COUNT(*)%20FROM%20zug%20WHERE%20spiel_id%20%3D%201%20AND%20treffer%20%3D%201)'
      );
    });
  });
});
