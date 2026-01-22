import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionCentreComponent } from './directionCentre.component';

describe('DirectionCentreComponent', () => {
  let component: DirectionCentreComponent;
  let fixture: ComponentFixture<DirectionCentreComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionCentreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
