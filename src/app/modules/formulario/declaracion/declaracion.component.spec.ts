import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionComponent } from './declaracion.component';

describe('DeclaracionComponent', () => {
  let component: DeclaracionComponent;
  let fixture: ComponentFixture<DeclaracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeclaracionComponent]
    });
    fixture = TestBed.createComponent(DeclaracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
