import { TestBed } from '@angular/core/testing';

import { PlanetsService } from './planets.service';

xdescribe('PlanetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanetsService = TestBed.get(PlanetsService);
    expect(service).toBeTruthy();
  });
});
