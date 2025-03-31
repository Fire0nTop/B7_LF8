import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlTesterComponent } from './sql-tester.component';

describe('SqlTesterComponent', () => {
  let component: SqlTesterComponent;
  let fixture: ComponentFixture<SqlTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
