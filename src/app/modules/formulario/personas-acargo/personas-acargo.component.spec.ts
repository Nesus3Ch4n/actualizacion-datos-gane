import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasAcargoComponent } from './personas-acargo.component';

describe('PersonasAcargoComponent', () => {
  let component: PersonasAcargoComponent;
  let fixture: ComponentFixture<PersonasAcargoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonasAcargoComponent]
    });
    fixture = TestBed.createComponent(PersonasAcargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
