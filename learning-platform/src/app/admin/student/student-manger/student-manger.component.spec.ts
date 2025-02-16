import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMangerComponent } from './student-manger.component';

describe('StudentMangerComponent', () => {
  let component: StudentMangerComponent;
  let fixture: ComponentFixture<StudentMangerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentMangerComponent]
    });
    fixture = TestBed.createComponent(StudentMangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
