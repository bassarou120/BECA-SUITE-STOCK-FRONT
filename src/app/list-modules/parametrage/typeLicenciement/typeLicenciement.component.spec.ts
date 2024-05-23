import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeLicenciementComponent } from './typeLicenciement.component';

describe('PremiumsComponent', () => {
  let component: TypeLicenciementComponent;
  let fixture: ComponentFixture<TypeLicenciementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeLicenciementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeLicenciementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
