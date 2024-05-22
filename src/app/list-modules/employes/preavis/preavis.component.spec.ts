import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaintesComponent } from './preavis.component';

describe('PlaintesComponent', () => {
  let component: PlaintesComponent;
  let fixture: ComponentFixture<PlaintesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaintesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaintesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
