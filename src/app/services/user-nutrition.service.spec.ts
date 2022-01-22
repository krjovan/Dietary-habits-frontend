import { TestBed } from '@angular/core/testing';

import { UserNutritionService } from './user-nutrition.service';

describe('UserNutritionService', () => {
  let service: UserNutritionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNutritionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
