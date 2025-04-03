import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDatabaseServiceComponent } from './test-database-service.component';

describe('TestDatabaseServiceComponent', () => {
  let component: TestDatabaseServiceComponent;
  let fixture: ComponentFixture<TestDatabaseServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDatabaseServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDatabaseServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
