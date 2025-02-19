import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciementComponent } from './licenciement.component';

describe('LicenciementComponent', () => {
  let component: LicenciementComponent;
  let fixture: ComponentFixture<LicenciementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenciementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenciementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
