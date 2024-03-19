import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeContratComponent } from './typeContrat.component';

describe('TypeContratComponent', () => {
  let component: TypeContratComponent;
  let fixture: ComponentFixture<TypeContratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeContratComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
