import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointCongeComponent } from './point-conge.component';

describe('PointCongeComponent', () => {
  let component: PointCongeComponent;
  let fixture: ComponentFixture<PointCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointCongeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
