import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConnectionServiceComponent } from './test-connection-service.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TestConnectionServiceComponent', () => {
  let component: TestConnectionServiceComponent;
  let fixture: ComponentFixture<TestConnectionServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestConnectionServiceComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestConnectionServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
