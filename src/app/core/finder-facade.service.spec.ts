import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { FinderFacadeService } from './finder-facade.service';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { FalconFinderService } from './falcon-finder.service';
import { Router } from '@angular/router';
import { IPlanet } from './models/planet';
import { of } from 'rxjs';
import { IVehicle } from './models/vehicle';
import { IFalconAppState } from './models/falconApp.state';
import { ISearchAttempt } from './models/searchAttempt';

describe('FinderFacadeService', () => {

  let planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock;
  let planetListToBeReturned : IPlanet[],  vehiclesToBeReturned : IVehicle[];
  const apiTokenToBeReturned : string = "plmVHX"; ;

  beforeEach(() => {
    
    planetServiceMock = jasmine.createSpyObj(['getAllPlanets']);

    vehiclesServiceMock = jasmine.createSpyObj(['getAllVehicles']);

    falconFinderServiceMock = jasmine.createSpyObj(['getFalconFinderApiToken', 'findFalcon']);

    routerServiceMock = jasmine.createSpyObj(['navigate']);
    
    TestBed.configureTestingModule({
    providers : [
      {provide : PlanetsService, useValue : planetServiceMock},
      {provide : VehiclesService, useValue : vehiclesServiceMock} , 
      {provide : FalconFinderService, useValue : falconFinderServiceMock}, 
      {provide : Router, useValue : routerServiceMock}]
    });

    planetListToBeReturned  = [
      {name : 'Donlon', distance: 100, includedInSearch : false},
      {name : 'Enchai', distance: 200, includedInSearch : false},
      {name : 'Jebing', distance: 300, includedInSearch : false},
      {name : 'Sapir', distance: 100, includedInSearch : false}
    ]; 
    
    vehiclesToBeReturned = [
      {name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
      {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
      {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
      {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
    ];
    
  });

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
       expect(vm.maxCountPlanetsToBeSearched).toEqual(4);
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

  it('should set correct initial state when initializeAppData() is called', () => {

    const service : FinderFacadeService = TestBed.get(FinderFacadeService);
    
    planetServiceMock.getAllPlanets.and.returnValue(of(planetListToBeReturned));
    vehiclesServiceMock.getAllVehicles.and.returnValue(of(vehiclesToBeReturned));
    falconFinderServiceMock.getFalconFinderApiToken.and.returnValue(of(apiTokenToBeReturned));

    service.initializeAppData();

    
    // const initializedAppState : IFalconAppState = {
    //   planetList : planetListToBeReturned,
    //   vehicleList : vehiclesToBeReturned,
    //   searchMap : new Map<string, ISearchAttempt>([['1', <ISearchAttempt>{}],['2', <ISearchAttempt>{}],['3', <ISearchAttempt>{}],['4', <ISearchAttempt>{}]]),//service['getInitializedSearchMap'](),
    //   availablePlanetListMap : new Map<string, IPlanet[]>([['1', planetListToBeReturned], ['2', planetListToBeReturned], ['3', planetListToBeReturned], ['4', planetListToBeReturned]]),//service['getMapWithAllPlanets'](planetListToBeReturned),
    //   availableVehicleListMap : new Map<string, IVehicle[]>([['1', vehiclesToBeReturned], ['2', vehiclesToBeReturned], ['3', vehiclesToBeReturned], ['4', vehiclesToBeReturned]]),//service['getMapWithAllVehicles'](vehiclesToBeReturned),
    //   errorMsg : "",
    //   isLoading : false,
    //   isReadyToSearch : false,
    //   planetFoundOn : null,
    //   lastUpdatedWidgetId : null,
    //   totalTimeTaken : 0,
    //   maxSearchAttemptAllowed : 4            
    // }; 

    service['store$'].subscribe( (state) => {
       
       expect(state.errorMsg).toEqual("");
       expect(state.isLoading).toBeFalsy();
       expect(state.isReadyToSearch).toBeFalsy();
       expect(state.maxSearchAttemptAllowed).toEqual(4);
       expect(state.totalTimeTaken).toEqual(0);
       expect(state.planetList).toEqual(planetListToBeReturned);
       expect(state.vehicleList).toEqual(vehiclesToBeReturned);
       expect(state.availablePlanetListMap.size).toEqual(planetListToBeReturned.length);
       expect(state.availablePlanetListMap.get('1')).toEqual(planetListToBeReturned);
       expect(state.availableVehicleListMap.size).toEqual(vehiclesToBeReturned.length);
       expect(state.availableVehicleListMap.get('1')).toEqual(vehiclesToBeReturned);
       expect(state.searchMap.size).toEqual(4);
       expect(state.searchMap.get('1').searchedPlanet).toEqual(null);
       expect(state.searchMap.get('1').vehicleUsed).toEqual(null);
       expect(state.planetFoundOn).toEqual(null);
       expect(state.lastUpdatedWidgetId).toEqual(null);              

    });
    
  });
});
