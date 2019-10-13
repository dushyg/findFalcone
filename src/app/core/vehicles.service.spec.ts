import { TestBed } from '@angular/core/testing';

import { VehiclesService } from './vehicles.service';

xdescribe('VehiclesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehiclesService = TestBed.get(VehiclesService);
    expect(service).toBeTruthy();
  });
});
