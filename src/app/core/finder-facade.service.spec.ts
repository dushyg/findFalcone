import { TestBed, fakeAsync, flush } from '@angular/core/testing';

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

  it('should setup dashboardVm$ to return expected initial values', () => {

    const service: FinderFacadeService = TestBed.get(FinderFacadeService);
    
    service.dashboardVm$.subscribe( (vm) => {
       expect(vm.error).toEqual("");
       expect(vm.isLoading).toBeFalsy();
       expect(vm.isReadyForSearch).toBeFalsy();
       expect(vm.maxCountPlanetsToBeSearched).toEqual(service.getCountOfWidgetsDisplayed());
       expect(vm.totalTimeTaken).toEqual(0);
    });

  });

  it('should setup dashboardVm$ to return expected initial values - async', fakeAsync( () => {

    const service: FinderFacadeService = TestBed.get(FinderFacadeService);
    
    service.dashboardVm$.subscribe( (vm) => {
       expect(vm.error).toEqual("");
       expect(vm.isLoading).toBeFalsy();
       expect(vm.isReadyForSearch).toBeFalsy();
       expect(vm.maxCountPlanetsToBeSearched).toEqual(service.getCountOfWidgetsDisplayed());
       expect(vm.totalTimeTaken).toEqual(0);
    });
    flush();
  }));

  it('should set isLoading to true when setLoadingFlag is called with true', () => {

    const service : FinderFacadeService = TestBed.get(FinderFacadeService);

    service["setLoadingFlag"](true);

    service.isLoading$.subscribe( (isLoading) => {

      expect(isLoading).toBeTruthy();

    });
  });

  it('should set isLoading to false when setLoadingFlag is called with false', () => {

    const service : FinderFacadeService = TestBed.get(FinderFacadeService);

    service["setLoadingFlag"](false);

    service.isLoading$.subscribe( (isLoading) => {

      expect(isLoading).toBeFalsy();
      
    });
  });
});
