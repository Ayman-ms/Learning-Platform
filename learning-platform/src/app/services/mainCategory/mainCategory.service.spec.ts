import { TestBed } from '@angular/core/testing';

import { MainCategoryService } from './mainCategory.service';

describe('CategoriesServiceService', () => {
  let service: MainCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
