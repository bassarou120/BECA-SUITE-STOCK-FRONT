import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresSupplementairesComponent } from './heures_supplementaires.component';

describe('HeuresSupplementairesComponent', () => {
  let component: HeuresSupplementairesComponent;
  let fixture: ComponentFixture<HeuresSupplementairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresSupplementairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeuresSupplementairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
