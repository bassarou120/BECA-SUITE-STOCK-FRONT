import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordMailComponent } from './passwordMail.component';

describe('PasswordMailComponent', () => {
  let component: PasswordMailComponent;
  let fixture: ComponentFixture<PasswordMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
