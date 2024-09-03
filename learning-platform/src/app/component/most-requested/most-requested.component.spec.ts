import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostRequestedComponent } from './most-requested.component';

describe('MostRequestedComponent', () => {
  let component: MostRequestedComponent;
  let fixture: ComponentFixture<MostRequestedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MostRequestedComponent]
    });
    fixture = TestBed.createComponent(MostRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
