import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackGameCellComponent } from './attack-game-cell.component';

describe('AttackGameCellComponent', () => {
  let component: AttackGameCellComponent;
  let fixture: ComponentFixture<AttackGameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttackGameCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackGameCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
