import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleImmoComponent } from './famille-immo.component';

describe('FamilleComponent', () => {
  let component: FamilleImmoComponent;
  let fixture: ComponentFixture<FamilleImmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilleImmoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilleImmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
