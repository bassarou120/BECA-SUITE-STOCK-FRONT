import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesPlaintesComponent } from './mes-plaintes.component';

describe('MesPlaintesComponent', () => {
  let component: MesPlaintesComponent;
  let fixture: ComponentFixture<MesPlaintesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesPlaintesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesPlaintesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
