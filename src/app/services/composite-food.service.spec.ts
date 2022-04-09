import { TestBed } from '@angular/core/testing';

import { CompositeFoodService } from './composite-food.service';

describe('CompositeFoodService', () => {
  let service: CompositeFoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompositeFoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
