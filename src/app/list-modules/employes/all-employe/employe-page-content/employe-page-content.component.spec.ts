import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployePageContentComponent } from './employe-page-content.component';

describe('EmployeePageContentComponent', () => {
  let component: EmployePageContentComponent;
  let fixture: ComponentFixture<EmployePageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployePageContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployePageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
