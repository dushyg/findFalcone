import { TestBed } from '@angular/core/testing';

import { FinderFacadeService } from './finder-facade.service';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { FalconFinderService } from './falcon-finder.service';
import { Router } from '@angular/router';

describe('FinderFacadeService', () => {

  const planetServiceMock : PlanetsService = jasmine.createSpyObj(['getAllPlanets']);

  const vehiclesServiceMock : VehiclesService = jasmine.createSpyObj(['getAllVehicles']);

  const falconFinderServiceMock : FalconFinderService = jasmine.createSpyObj(['findFalcon']);

  const routerServiceMock : Router = jasmine.createSpyObj(['navigate']);

  beforeEach(() => TestBed.configureTestingModule({
    providers : [
      {provide : PlanetsService, useValue : planetServiceMock},
      {provide : VehiclesService, useValue : vehiclesServiceMock} , 
      {provide : FalconFinderService, useValue : falconFinderServiceMock}, 
      {provide : Router, useValue : routerServiceMock}]
  }));

  it('should be created', () => {
    const service: FinderFacadeService = TestBed.get(FinderFacadeService);
    expect(service).toBeTruthy();
  });
  
});
