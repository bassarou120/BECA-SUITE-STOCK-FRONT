import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAbsenceComponent } from './typeAbsence.component';

describe('PostesComponent', () => {
  let component: TypeAbsenceComponent;
  let fixture: ComponentFixture<TypeAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeAbsenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
