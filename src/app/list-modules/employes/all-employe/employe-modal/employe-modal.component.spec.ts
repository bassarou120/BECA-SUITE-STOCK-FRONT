import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeModalComponent } from './employe-modal.component';

describe('EmployeeModalComponent', () => {
  let component: EmployeModalComponent;
  let fixture: ComponentFixture<EmployeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
