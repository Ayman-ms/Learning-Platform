import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainCategoryComponent } from './admin-main-category.component';

describe('AdminMainCategoryComponent', () => {
  let component: AdminMainCategoryComponent;
  let fixture: ComponentFixture<AdminMainCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMainCategoryComponent]
    });
    fixture = TestBed.createComponent(AdminMainCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
