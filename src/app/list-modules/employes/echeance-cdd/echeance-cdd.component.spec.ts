import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcheanceCDDComponent } from './echeance-cdd.component';

describe('DepartEmployeComponent', () => {
  let component: EcheanceCDDComponent;
  let fixture: ComponentFixture<EcheanceCDDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcheanceCDDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcheanceCDDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
