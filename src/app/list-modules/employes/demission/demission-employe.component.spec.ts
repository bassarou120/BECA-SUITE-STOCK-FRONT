import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemissionEmployeComponent } from './demission-employe.component';

describe('DemissionEmployeComponent', () => {
  let component: DemissionEmployeComponent;
  let fixture: ComponentFixture<DemissionEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemissionEmployeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemissionEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
