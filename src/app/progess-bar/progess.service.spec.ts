import { TestBed } from '@angular/core/testing';

import { ProgessService } from './progess.service';

describe('ProgessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgessService = TestBed.get(ProgessService);
    expect(service).toBeTruthy();
  });
});
