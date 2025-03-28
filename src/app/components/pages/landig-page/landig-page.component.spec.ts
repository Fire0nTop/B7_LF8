import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandigPageComponent } from './landig-page.component';

describe('LandigPageComponent', () => {
  let component: LandigPageComponent;
  let fixture: ComponentFixture<LandigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandigPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
