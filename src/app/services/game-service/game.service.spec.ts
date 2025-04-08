import { TestBed } from '@angular/core/testing';
import {GameService} from './game.service';
import {GameComponent} from '@components/game/game.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('GameServiceService', () => {
  let service: GameService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    await TestBed.configureTestingModule({
      imports: [GameComponent, HttpClientTestingModule]
    })
      .compileComponents();
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
