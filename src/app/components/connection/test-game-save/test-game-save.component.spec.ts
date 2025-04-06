import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGameSaveComponent } from './test-game-save.component';

describe('TestGameSaveComponent', () => {
  let component: TestGameSaveComponent;
  let fixture: ComponentFixture<TestGameSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGameSaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestGameSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
