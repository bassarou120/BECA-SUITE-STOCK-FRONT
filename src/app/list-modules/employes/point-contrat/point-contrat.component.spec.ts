import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointContratComponent } from './point-contrat.component';

describe('PointContratComponent', () => {
  let component: PointContratComponent;
  let fixture: ComponentFixture<PointContratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointContratComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
