import { fakeAsync, flush, tick } from '@angular/core/testing';
import { of, asyncScheduler } from 'rxjs';

import { IPlanet } from './models/planet';
import { FinderFacadeService } from './finder-facade.service';
import { IVehicle } from './models/vehicle';
import VehicleChange from './models/vehicleChange';
import PlanetChange from './models/planetChange';
import { IFalconAppState } from './models/falconApp.state';
import { ISearchAttempt } from './models/searchAttempt';

// Isolated unit tests
describe('FinderFacadeService', () => {

  let planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock;
  let planetListToBeReturned : IPlanet[],  vehicleListToBeReturned : IVehicle[];
  const apiTokenToBeReturned : string = "plmVHX"; 
  
  beforeEach(() => {
    
    planetServiceMock = jasmine.createSpyObj(['getAllPlanets']);

    vehiclesServiceMock = jasmine.createSpyObj(['getAllVehicles']);

    falconFinderServiceMock = jasmine.createSpyObj(['getFalconFinderApiToken', 'findFalcon']);

    routerServiceMock = jasmine.createSpyObj(['navigate']);
    
    planetListToBeReturned  = [
      {name : 'Donlon', distance: 100, includedInSearch : false},
      {name : 'Enchai', distance: 200, includedInSearch : false},
      {name : 'Jebing', distance: 300, includedInSearch : false},
      {name : 'Sapir', distance: 100, includedInSearch : false}
    ]; 
    
    vehicleListToBeReturned = [
      {name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
      {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
      {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
      {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
    ];
    
    
  });

  describe('Initialization Tests', () => {

    it('should be created', () => {
      //const service: FinderFacadeService = TestBed.get(FinderFacadeService);
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);
      
      expect(service).toBeTruthy();
    });
  
    it('should setup dashboardVm$ to return expected initial values', () => {
  
      //const service: FinderFacadeService = TestBed.get(FinderFacadeService);
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);
      
      service.dashboardVm$.subscribe( (vm) => {
         expect(vm.error).toEqual("");
         expect(vm.isLoading).toBeFalsy();
         expect(vm.isReadyForSearch).toBeFalsy();
         expect(vm.maxCountPlanetsToBeSearched).toEqual(service.getCountOfWidgetsDisplayed());
         expect(vm.totalTimeTaken).toEqual(0);
      });
  
    });
  
     it('should set isLoading to true when setLoadingFlag is called with true', () => {
  
     // const service : FinderFacadeService = TestBed.get(FinderFacadeService);
     const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);
  
      service["setLoadingFlag"](true);
  
      service.isLoading$.subscribe( (isLoading) => {
  
        expect(isLoading).toBeTruthy();
  
      });
    });
  
    it('should set isLoading to false when setLoadingFlag is called with false', () => {
  
      //const service : FinderFacadeService = TestBed.get(FinderFacadeService);
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);
  
      service["setLoadingFlag"](false);
  
      service.isLoading$.subscribe( (isLoading) => {
  
        expect(isLoading).toBeFalsy();
        
      });
    });
      
    it('should set correct initial state when initializeAppData() is called', fakeAsync(() => {
  
      //const service : FinderFacadeService = TestBed.get(FinderFacadeService);
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);
      
      planetServiceMock.getAllPlanets.and.returnValue(of(planetListToBeReturned, asyncScheduler));
      vehiclesServiceMock.getAllVehicles.and.returnValue(of(vehicleListToBeReturned, asyncScheduler));
      falconFinderServiceMock.getFalconFinderApiToken.and.returnValue(of(apiTokenToBeReturned, asyncScheduler));
  
      service.initializeAppData();
      
      tick();
      
      service['store$'].subscribe( (state) => {
         
         expect(state.errorMsg).toEqual("");
         expect(state.isLoading).toBeFalsy();
         expect(state.isReadyToSearch).toBeFalsy();
         expect(state.maxSearchAttemptAllowed).toEqual(4);
         expect(state.totalTimeTaken).toEqual(0);
         expect(state.planetList).toEqual(planetListToBeReturned);
         expect(state.vehicleList).toEqual(vehicleListToBeReturned);
         expect(state.availablePlanetListMap.size).toEqual(planetListToBeReturned.length);
         expect(state.availablePlanetListMap.get('1')).toEqual(planetListToBeReturned);
         expect(state.availableVehicleListMap.size).toEqual(vehicleListToBeReturned.length);
         expect(state.availableVehicleListMap.get('1')).toEqual(vehicleListToBeReturned);
         expect(state.searchMap.size).toEqual(4);
         expect(state.searchMap.get('1').searchedPlanet).toEqual(undefined);
         expect(state.searchMap.get('1').vehicleUsed).toEqual(undefined);
         expect(state.planetFoundOn).toEqual(null);
         expect(state.lastUpdatedWidgetId).toEqual(null);              
  
      });
      
    }));

  });

  describe('Planet and Vehicle Changes Tests', () => {

    let expectedState : IFalconAppState ;    
    let searchAttemptMap : Map<string, ISearchAttempt>;
    let availablePlanetListMap : Map<string, IPlanet[]>;
    let availableVehicleListMap : Map<string, IVehicle[]>;

    beforeEach(() => {
      
      searchAttemptMap = new Map<string, ISearchAttempt>([['1', <ISearchAttempt>{searchedPlanet: null, vehicleUsed : null}],['2', <ISearchAttempt>{searchedPlanet: null, vehicleUsed : null}],['3', <ISearchAttempt>{searchedPlanet: null, vehicleUsed : null}],['4', <ISearchAttempt>{searchedPlanet: null, vehicleUsed : null}]]);

      availablePlanetListMap = new Map<string, IPlanet[]>([['1', planetListToBeReturned], ['2', planetListToBeReturned], ['3', planetListToBeReturned], ['4', planetListToBeReturned]]);

      availableVehicleListMap = new Map<string, IVehicle[]>([['1', vehicleListToBeReturned], ['2', vehicleListToBeReturned], ['3', vehicleListToBeReturned], ['4', vehicleListToBeReturned]]);

      expectedState = {
        "errorMsg": "",
        "isLoading": false,
        "maxSearchAttemptAllowed": 4,
        "planetList": planetListToBeReturned,
        "searchMap": searchAttemptMap,
        "availablePlanetListMap": availablePlanetListMap,
        "availableVehicleListMap": availableVehicleListMap,
        "totalTimeTaken": 0,
        "vehicleList": vehicleListToBeReturned,
        "planetFoundOn": null,
        "isReadyToSearch": false,
        "lastUpdatedWidgetId": null
      };

      planetServiceMock.getAllPlanets.and.returnValue(of(planetListToBeReturned, asyncScheduler));
      vehiclesServiceMock.getAllVehicles.and.returnValue(of(vehicleListToBeReturned, asyncScheduler));
      falconFinderServiceMock.getFalconFinderApiToken.and.returnValue(of(apiTokenToBeReturned, asyncScheduler));
    });

    it('should set expected state when a planet is set for the first time', fakeAsync(()=>{
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      const newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};      
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: null});
      const filteredPlanetList = planetListToBeReturned.filter(p => p.name !== newPlanet.name);
      expectedState.availablePlanetListMap.set('2', filteredPlanetList).set('3', filteredPlanetList).set('4', filteredPlanetList);
      expectedState.lastUpdatedWidgetId = 1;

      // act
      service.planetChanged(new PlanetChange(1, null, newPlanet));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should set expected state when a vehicle is set for the first time', fakeAsync(()=>{

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      const newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};   
      const newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };

      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: null});
      const filteredPlanetList = planetListToBeReturned.filter(p => p.name !== newPlanet.name);
      expectedState.availablePlanetListMap.set('2', filteredPlanetList).set('3', filteredPlanetList).set('4', filteredPlanetList);
      expectedState.lastUpdatedWidgetId = 1;
      expectedState.totalTimeTaken = 50;

      service.planetChanged(new PlanetChange(1, null, newPlanet));

      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      const filteredVehicleList = [
        {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ];
      expectedState.availableVehicleListMap.set('1', filteredVehicleList).set('2', filteredVehicleList).set('3', filteredVehicleList).set('4', filteredVehicleList);

      // act      
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));

      // assert
      expect(service['_state']).toEqual(expectedState);
            
    }));
  });
    
});
