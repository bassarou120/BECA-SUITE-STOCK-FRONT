import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartEmployeComponent } from './depart-employe.component';

describe('DepartEmployeComponent', () => {
  let component: DepartEmployeComponent;
  let fixture: ComponentFixture<DepartEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartEmployeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
