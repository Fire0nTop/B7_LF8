import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCellComponent } from './game-cell.component';

describe('GameCellComponent', () => {
  let component: GameCellComponent;
  let fixture: ComponentFixture<GameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCellComponent]
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
