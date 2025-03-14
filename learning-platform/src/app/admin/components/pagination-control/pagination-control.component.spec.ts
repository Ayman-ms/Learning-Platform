import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationControlComponent } from './pagination-control.component';

describe('PaginationControlComponent', () => {
  let component: PaginationControlComponent;
  let fixture: ComponentFixture<PaginationControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationControlComponent]
    });
    fixture = TestBed.createComponent(PaginationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
