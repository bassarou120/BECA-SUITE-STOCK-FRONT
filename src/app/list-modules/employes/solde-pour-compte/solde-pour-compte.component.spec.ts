import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldePourCompteComponent } from './solde-pour-compte.component';

describe('DepartEmployeComponent', () => {
  let component: SoldePourCompteComponent;
  let fixture: ComponentFixture<SoldePourCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldePourCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldePourCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
