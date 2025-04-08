import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGameSaveComponent } from './test-game-save.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TestGameSaveComponent', () => {
  let component: TestGameSaveComponent;
  let fixture: ComponentFixture<TestGameSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGameSaveComponent,HttpClientTestingModule]
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
