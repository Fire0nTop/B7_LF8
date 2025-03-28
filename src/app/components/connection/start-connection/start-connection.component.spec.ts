import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartConnectionComponent } from './start-connection.component';

describe('StartConnectionComponent', () => {
  let component: StartConnectionComponent;
  let fixture: ComponentFixture<StartConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartConnectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
