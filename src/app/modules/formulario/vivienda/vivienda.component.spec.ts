import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViviendaComponent } from './vivienda.component';

describe('ViviendaComponent', () => {
  let component: ViviendaComponent;
  let fixture: ComponentFixture<ViviendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViviendaComponent]
    });
    fixture = TestBed.createComponent(ViviendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
