import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesHeuresSupplementairesComponent } from './mes-heures-supplementaires.component';

describe('MesHeuresSupplementairesComponent', () => {
  let component: MesHeuresSupplementairesComponent;
  let fixture: ComponentFixture<MesHeuresSupplementairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesHeuresSupplementairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesHeuresSupplementairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
