import { TestBed } from '@angular/core/testing';

import { FinderFacadeService } from './finder-facade.service';

describe('FinderFacadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinderFacadeService = TestBed.get(FinderFacadeService);
    expect(service).toBeTruthy();
  });
});
