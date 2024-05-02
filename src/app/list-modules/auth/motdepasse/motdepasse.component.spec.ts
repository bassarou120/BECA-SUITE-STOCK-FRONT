import { ComponentFixture, TestBed } from '@angular/core/testing';

import { motdepasseComponent } from './motdepasse.component';

describe('motdepasseComponent', () => {
  let component: motdepasseComponent;
  let fixture: ComponentFixture<motdepasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ motdepasseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(motdepasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
