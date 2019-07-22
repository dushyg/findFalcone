import { TestBed } from '@angular/core/testing';

import { FalconFinderService } from './falcon-finder.service';

describe('FalconFinderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FalconFinderService = TestBed.get(FalconFinderService);
    expect(service).toBeTruthy();
  });
});
