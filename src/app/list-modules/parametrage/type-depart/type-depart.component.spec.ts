import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDepartComponent } from './type-depart.component';

describe('PostesComponent', () => {
  let component: TypeDepartComponent;
  let fixture: ComponentFixture<TypeDepartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeDepartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeDepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
