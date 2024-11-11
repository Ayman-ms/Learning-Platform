import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminControllComponent } from './admin-controll.component';

describe('AdminControllComponent', () => {
  let component: AdminControllComponent;
  let fixture: ComponentFixture<AdminControllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminControllComponent]
    });
    fixture = TestBed.createComponent(AdminControllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
