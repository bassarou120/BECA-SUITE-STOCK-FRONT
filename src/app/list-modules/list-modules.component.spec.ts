import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModulesComponent } from './list-modules.component';

describe('ModulesComponent', () => {
  let component: ListModulesComponent;
  let fixture: ComponentFixture<ListModulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListModulesComponent]
    });
    fixture = TestBed.createComponent(ListModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
