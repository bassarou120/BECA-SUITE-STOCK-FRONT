import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosDeBaseComponent } from './infos-de-base.component';

describe('InfosDeBaseComponent', () => {
  let component: InfosDeBaseComponent;
  let fixture: ComponentFixture<InfosDeBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosDeBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosDeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
