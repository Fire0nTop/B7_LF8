import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCellComponent } from './game-cell.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('GameCellComponent', () => {
  let component: GameCellComponent;
  let fixture: ComponentFixture<GameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCellComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
