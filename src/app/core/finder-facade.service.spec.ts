

import { fakeAsync, tick } from '@angular/core/testing';
import { of, asyncScheduler } from 'rxjs';

import { IPlanet } from './models/planet';
import { FinderFacadeService } from './finder-facade.service';
import { IVehicle } from './models/vehicle';
import VehicleChange from './models/vehicleChange';
import PlanetChange from './models/planetChange';
import { IFalconAppState } from './models/falconApp.state';
import { ISearchAttempt } from './models/searchAttempt';
import { createSpyObj } from './utitlity';
import { IFindFalconResponse } from './models/find-falcon-response';

// Isolated unit tests
describe('FinderFacadeService', () => {

  let planetServiceMock , vehiclesServiceMock , falconFinderServiceMock , routerServiceMock ;
  let planetListToBeReturned : IPlanet[],  vehicleListToBeReturned : IVehicle[];
  const apiTokenToBeReturned : string = "plmVHX"; 
  
  beforeEach(() => {
    
    /*planetServiceMock = jasmine.createSpyObj(['getAllPlanets']);

    vehiclesServiceMock = jasmine.createSpyObj(['getAllVehicles']);

    falconFinderServiceMock = jasmine.createSpyObj(['getFalconFinderApiToken', 'findFalcon']);

    routerServiceMock = jasmine.createSpyObj(['navigate']);*/
    planetServiceMock = createSpyObj(['getAllPlanets']);     
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    falconFinderServiceMock = createSpyObj(['getFalconFinderApiToken', 'findFalcon']);
    routerServiceMock = createSpyObj(['navigate']);
    
    planetListToBeReturned  = [
      {name : 'Donlon', distance: 100, includedInSearch : false},
      {name : 'Enchai', distance: 200, includedInSearch : false},
      {name : 'Jebing', distance: 300, includedInSearch : false},
      {name : 'Sapir', distance: 400, includedInSearch : false}
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
      
      // planetServiceMock.getAllPlanets.and.returnValue(of(planetListToBeReturned, asyncScheduler));
      // vehiclesServiceMock.getAllVehicles.and.returnValue(of(vehicleListToBeReturned, asyncScheduler));
      // falconFinderServiceMock.getFalconFinderApiToken.and.returnValue(of(apiTokenToBeReturned, asyncScheduler));
      planetServiceMock.getAllPlanets.mockReturnValue(of(planetListToBeReturned, asyncScheduler));
      vehiclesServiceMock.getAllVehicles.mockReturnValue(of(vehicleListToBeReturned, asyncScheduler));
      falconFinderServiceMock.getFalconFinderApiToken.mockReturnValue(of(apiTokenToBeReturned, asyncScheduler));
  
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

    
    it('should expect router.navigate(["/finderboard/reset"]) to be called when resetApp is called', () => {
      
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      
      // act      
      service.resetApp();
      
      // assert
      expect(routerServiceMock.navigate.mock.calls.length).toEqual(1);
      expect(routerServiceMock.navigate.mock.calls[0][0]).toEqual(["/finderboard/reset"]);
    });
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

      planetServiceMock.getAllPlanets.mockReturnValue(of(planetListToBeReturned, asyncScheduler));
      vehiclesServiceMock.getAllVehicles.mockReturnValue(of(vehicleListToBeReturned, asyncScheduler));
      falconFinderServiceMock.getFalconFinderApiToken.mockReturnValue(of(apiTokenToBeReturned, asyncScheduler));
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
      (<any>expect(service['_state'])).toMatchSnapshot();
            
    }));

    it('should set expected state when vehicle is changed in the first widget', fakeAsync( () => {

       // arrange
       const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
       service.initializeAppData();
       tick();
       const newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};   
       let newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
       expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: null});
       const filteredPlanetList = planetListToBeReturned.filter(p => p.name !== newPlanet.name);
       expectedState.availablePlanetListMap.set('2', filteredPlanetList).set('3', filteredPlanetList).set('4', filteredPlanetList);
       expectedState.lastUpdatedWidgetId = 1;
       expectedState.totalTimeTaken = 10;
 
       service.planetChanged(new PlanetChange(1, null, newPlanet));
       service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));

       newVehicle = {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 };
       expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
       const filteredVehicleList = [
         {name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
         {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
         {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
         {name: 'Space ship', availNumUnits : 1, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
       ];
       expectedState.availableVehicleListMap.set('1', filteredVehicleList).set('2', filteredVehicleList).set('3', filteredVehicleList).set('4', filteredVehicleList);
 
       // act      
       service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 }));
 
       // assert
       expect(service['_state']).toEqual(expectedState);
    }));

    it('should set isReadyForSearch to true when all widgets are set with required inputs', fakeAsync( () => {

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('2', [        
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('3', [     
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('4', [             
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);

      expectedState.lastUpdatedWidgetId = 4;
      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;
      
      expectedState.availableVehicleListMap.set('1', [
        {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('2', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('3', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('4',  [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 0, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      
      // act      
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle));  
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    
    it('should reset widgets to the right when 1st widget planet is updated', fakeAsync( () => {

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      let availablePlanetListMapForLast3Widgets = [      
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ];
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('2', availablePlanetListMapForLast3Widgets);
      expectedState.availablePlanetListMap.set('3', availablePlanetListMapForLast3Widgets);
      expectedState.availablePlanetListMap.set('4', availablePlanetListMapForLast3Widgets);

      expectedState.lastUpdatedWidgetId = 1;
      expectedState.totalTimeTaken = 0;
      expectedState.isReadyToSearch = false;
      
      const availableVehicleList = [
        {name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ];

      expectedState.availableVehicleListMap.set('1', availableVehicleList);
      expectedState.availableVehicleListMap.set('2', availableVehicleList);
      expectedState.availableVehicleListMap.set('3', availableVehicleList);
      expectedState.availableVehicleListMap.set('4',  availableVehicleList);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };    
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };    
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle));   

      // act      
      // update planet in first widget
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};    
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: null});
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right when 1st widget vehicle is updated', fakeAsync( () => {

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      let availablePlanetListMapForLast3Widgets = [      
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ];
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
    
      expectedState.availablePlanetListMap.set('2', availablePlanetListMapForLast3Widgets);
      expectedState.availablePlanetListMap.set('3', availablePlanetListMapForLast3Widgets);
      expectedState.availablePlanetListMap.set('4', availablePlanetListMapForLast3Widgets);

      expectedState.lastUpdatedWidgetId = 1;
      expectedState.totalTimeTaken = 25;
      expectedState.isReadyToSearch = false;
      
      const availableVehicleList = [
        {name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ];
     
      expectedState.availableVehicleListMap.set('1', availableVehicleList);
      expectedState.availableVehicleListMap.set('2', availableVehicleList);
      expectedState.availableVehicleListMap.set('3', availableVehicleList);
      expectedState.availableVehicleListMap.set('4',  availableVehicleList);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };    
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };    
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle));   

      // act      
      // update vehicle in first widget
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false}; 
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 };       
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});
      service.vehicleChanged(new VehicleChange(1, null, newVehicle)); 
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right (but not the 1st and 2nd widget) when 3rd widget planet is updated', fakeAsync( () => {

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('2', [        
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('3', [     
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('4', [             
        {name : 'Jebing', distance: 300, includedInSearch : false}
      ]);

      expectedState.lastUpdatedWidgetId = 3;
      expectedState.totalTimeTaken = 150;
      expectedState.isReadyToSearch = false;
          
      expectedState.availableVehicleListMap.set('1', [
        {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('2', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('3', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('4',  [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle)); 

      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: null});
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});

      // act  
      // updated planet for 3rd widget    
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      service.planetChanged(new PlanetChange(3, null, newPlanet));    
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right (but not the 1st and 2nd widget) when 3rd widget vehicle is updated', fakeAsync( () => {

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('2', [        
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('3', [     
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('4', [             
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);

      expectedState.lastUpdatedWidgetId = 3;
      expectedState.totalTimeTaken = 210;
      expectedState.isReadyToSearch = false;
          
      expectedState.availableVehicleListMap.set('1', [
        {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('2', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('3', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 0, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('4',  [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 0, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };    
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle)); 

      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: null, vehicleUsed: null});

      // act  
      // updated planet for 3rd widget    
      
      service.vehicleChanged(new VehicleChange(3, null, newVehicle)); 
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

  });

  describe('FindFalcone api Tests', () => {

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

      planetServiceMock.getAllPlanets.mockReturnValue(of(planetListToBeReturned, asyncScheduler));
      vehiclesServiceMock.getAllVehicles.mockReturnValue(of(vehicleListToBeReturned, asyncScheduler));
      falconFinderServiceMock.getFalconFinderApiToken.mockReturnValue(of(apiTokenToBeReturned, asyncScheduler));
      
    });

    it('should set in state, name of planet falcon was found on, when falcon is found', fakeAsync( () => {
        const findFalconApiResponse = <IFindFalconResponse>{
          error : "",
          planetName : "Donlon",
          status : "success"
        };

        falconFinderServiceMock.findFalcon.mockReturnValue(of(findFalconApiResponse, asyncScheduler));

        // arrange
        const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
        service.initializeAppData();
        tick();
        let newPlanet : IPlanet;   
        let newVehicle : IVehicle;      
        
        expectedState.availablePlanetListMap.set('1', [
          {name : 'Donlon', distance: 100, includedInSearch : false},
          {name : 'Enchai', distance: 200, includedInSearch : false},
          {name : 'Jebing', distance: 300, includedInSearch : false},
          {name : 'Sapir', distance: 400, includedInSearch : false}
        ]);
        expectedState.availablePlanetListMap.set('2', [        
          {name : 'Enchai', distance: 200, includedInSearch : false},
          {name : 'Jebing', distance: 300, includedInSearch : false},
          {name : 'Sapir', distance: 400, includedInSearch : false}
        ]);
        expectedState.availablePlanetListMap.set('3', [     
          {name : 'Jebing', distance: 300, includedInSearch : false},
          {name : 'Sapir', distance: 400, includedInSearch : false}
        ]);
        expectedState.availablePlanetListMap.set('4', [             
          {name : 'Sapir', distance: 400, includedInSearch : false}
        ]);

        expectedState.lastUpdatedWidgetId = 4;
        expectedState.totalTimeTaken = 305;
        expectedState.isReadyToSearch = true;
        
        expectedState.availableVehicleListMap.set('1', [
          {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
          {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
          {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
          {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
        ]);
        expectedState.availableVehicleListMap.set('2', [
          {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
          {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
          {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
          {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
        ]);
        expectedState.availableVehicleListMap.set('3', [
          {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
          {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
          {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
          {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
        ]);
        expectedState.availableVehicleListMap.set('4',  [
          {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
          {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
          {name: 'Space shuttle', availNumUnits : 0, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
          {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
        ]);

        //set first widet
        newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
        newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
        expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
        service.planetChanged(new PlanetChange(1, null, newPlanet));
        service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
        
        //set 2nd widget
        newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
        newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
        expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
        service.planetChanged(new PlanetChange(2, null, newPlanet));
        service.vehicleChanged(new VehicleChange(2, null, newVehicle));

        //set 3rd widget
        newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
        newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };
        expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
        service.planetChanged(new PlanetChange(3, null, newPlanet));
        service.vehicleChanged(new VehicleChange(3, null, newVehicle));
        
        //set 4th widget
        newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
        newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };
        expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
        service.planetChanged(new PlanetChange(4, null, newPlanet));
        service.vehicleChanged(new VehicleChange(4, null, newVehicle));
        expectedState.planetFoundOn = "Donlon";
        // act      
        service.findFalcon();  
        tick();

        // assert
        expect(service['_state']).toEqual(expectedState);
        service.planetFoundOn$.subscribe(planetFoundOn => {
          expect(planetFoundOn).toEqual("Donlon");
        });
       
    }));

    it('should set in state, error message for not being able to find falcon, when falcon is not found', fakeAsync( () => {
      const findFalconApiResponse = <IFindFalconResponse>{
        error : "",
        planetName : "",
        status : "false"
      };

      falconFinderServiceMock.findFalcon.mockReturnValue(of(findFalconApiResponse, asyncScheduler));

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('2', [        
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('3', [     
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('4', [             
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);

      expectedState.lastUpdatedWidgetId = 4;
      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;
      
      expectedState.availableVehicleListMap.set('1', [
        {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('2', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('3', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('4',  [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 0, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle));
      expectedState.planetFoundOn = null;
      expectedState.errorMsg = "Failure! You were unable to find Falcone. Better luck next time.";

      // act      
      service.findFalcon();  
      tick();
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should set in state, error message when falcon api returns error message', fakeAsync( () => {
      const findFalconApiResponse = <IFindFalconResponse>{
        error : "Invalid Request",
        planetName : "",
        status : "false"
      };

      falconFinderServiceMock.findFalcon.mockReturnValue(of(findFalconApiResponse, asyncScheduler));

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(planetServiceMock, vehiclesServiceMock, falconFinderServiceMock, routerServiceMock);      
      service.initializeAppData();
      tick();
      let newPlanet : IPlanet;   
      let newVehicle : IVehicle;      
      
      expectedState.availablePlanetListMap.set('1', [
        {name : 'Donlon', distance: 100, includedInSearch : false},
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('2', [        
        {name : 'Enchai', distance: 200, includedInSearch : false},
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('3', [     
        {name : 'Jebing', distance: 300, includedInSearch : false},
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);
      expectedState.availablePlanetListMap.set('4', [             
        {name : 'Sapir', distance: 400, includedInSearch : false}
      ]);

      expectedState.lastUpdatedWidgetId = 4;
      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;
      
      expectedState.availableVehicleListMap.set('1', [
        {name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('2', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('3', [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);
      expectedState.availableVehicleListMap.set('4',  [
        {name: 'Space pod', availNumUnits : 0, maxDistance : 200 , speed : 2, totalNumUnits : 2 },
        {name: 'Space rocket', availNumUnits : 0, maxDistance : 300 , speed : 4, totalNumUnits : 1 },
        {name: 'Space shuttle', availNumUnits : 0, maxDistance : 400 , speed : 5, totalNumUnits : 1 },
        {name: 'Space ship', availNumUnits : 2, maxDistance : 600 , speed : 10, totalNumUnits : 2 },
      ]);

      //set first widet
      newPlanet = <IPlanet>{name : 'Donlon', distance: 100, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('1', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(1, null, newPlanet));
      service.vehicleChanged(new VehicleChange(1, null, <IVehicle>{name: 'Space pod', availNumUnits : 2, maxDistance : 200 , speed : 2, totalNumUnits : 2 }));
      
      //set 2nd widget
      newPlanet = <IPlanet>{name : 'Enchai', distance: 200, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space pod', availNumUnits : 1, maxDistance : 200 , speed : 2, totalNumUnits : 2 };
      expectedState.searchMap.set('2', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(2, null, newPlanet));
      service.vehicleChanged(new VehicleChange(2, null, newVehicle));

      //set 3rd widget
      newPlanet = <IPlanet>{name : 'Jebing', distance: 300, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space rocket', availNumUnits : 1, maxDistance : 300 , speed : 4, totalNumUnits : 1 };
      expectedState.searchMap.set('3',<ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(3, null, newPlanet));
      service.vehicleChanged(new VehicleChange(3, null, newVehicle));
      
      //set 4th widget
      newPlanet = <IPlanet>{name : 'Sapir', distance: 400, includedInSearch : false};
      newVehicle = <IVehicle>{name: 'Space shuttle', availNumUnits : 1, maxDistance : 400 , speed : 5, totalNumUnits : 1 };
      expectedState.searchMap.set('4', <ISearchAttempt>{searchedPlanet: newPlanet, vehicleUsed: newVehicle});
      service.planetChanged(new PlanetChange(4, null, newPlanet));
      service.vehicleChanged(new VehicleChange(4, null, newVehicle));
      expectedState.planetFoundOn = null;
      expectedState.errorMsg = "Invalid Request";

      // act      
      service.findFalcon();  
      tick();
      
      // assert
      expect(service['_state']).toEqual(expectedState);
    }));
  });
    
});
