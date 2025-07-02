import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicoComponent } from './academico.component';

describe('AcademicoComponent', () => {
  let component: AcademicoComponent;
  let fixture: ComponentFixture<AcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicoComponent]
    });
    fixture = TestBed.createComponent(AcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
