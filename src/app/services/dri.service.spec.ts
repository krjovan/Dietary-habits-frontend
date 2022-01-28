import { TestBed } from '@angular/core/testing';

import { DriService } from './dri.service';

describe('DriService', () => {
  let service: DriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
