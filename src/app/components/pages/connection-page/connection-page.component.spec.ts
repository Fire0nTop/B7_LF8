import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionPageComponent } from './connection-page.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ConnectionPageComponent', () => {
  let component: ConnectionPageComponent;
  let fixture: ComponentFixture<ConnectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionPageComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
