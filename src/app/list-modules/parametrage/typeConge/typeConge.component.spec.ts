import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCongeComponent } from './typeConge.component';

describe('TypeCongeComponent', () => {
  let component: TypeCongeComponent;
  let fixture: ComponentFixture<TypeCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeCongeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
