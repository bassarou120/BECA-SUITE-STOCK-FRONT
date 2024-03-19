import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePrimeComponent } from './typePrime.component';

describe('PremiumsComponent', () => {
  let component: TypePrimeComponent;
  let fixture: ComponentFixture<TypePrimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePrimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypePrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
