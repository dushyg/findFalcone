import { fakeAsync, tick } from '@angular/core/testing';
import { asyncScheduler, of } from 'rxjs';
import { IFalconAppState } from '../models/falconApp.state';
import { IPlanet } from '../models/planet';
import PlanetChange from '../models/planetChange';
import { ISearchAttempt } from '../models/searchAttempt';
import { IVehicle } from '../models/vehicle';
import VehicleChange from '../models/vehicleChange';
import { createSpyObj } from '../utitlity';
import { FinderFacadeService } from './finder-facade.service';

// Isolated unit tests
// tslint:disable: no-string-literal
describe('FinderFacadeService', () => {
  let planetServiceMock;
  let vehiclesServiceMock;
  let tokenServiceMock;
  let routerServiceMock;
  let planetListToBeReturned: IPlanet[];
  let vehicleListToBeReturned: IVehicle[];
  const apiTokenToBeReturned = 'plmVHX';

  beforeEach(() => {
    planetServiceMock = createSpyObj(['getAllPlanets']);
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    tokenServiceMock = createSpyObj(['getFalconeFinderApiToken']);
    routerServiceMock = createSpyObj(['navigate']);

    planetListToBeReturned = [
      { name: 'Donlon', distance: 100 },
      { name: 'Enchai', distance: 200 },
      { name: 'Jebing', distance: 300 },
      { name: 'Sapir', distance: 400 },
    ];

    vehicleListToBeReturned = [
      {
        name: 'Space pod',
        availNumUnits: 2,
        maxDistance: 200,
        speed: 2,
        totalNumUnits: 2,
      },
      {
        name: 'Space rocket',
        availNumUnits: 1,
        maxDistance: 300,
        speed: 4,
        totalNumUnits: 1,
      },
      {
        name: 'Space shuttle',
        availNumUnits: 1,
        maxDistance: 400,
        speed: 5,
        totalNumUnits: 1,
      },
      {
        name: 'Space ship',
        availNumUnits: 2,
        maxDistance: 600,
        speed: 10,
        totalNumUnits: 2,
      },
    ];
  });

  describe('Initialization Tests', () => {
    it('should be created', () => {
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );

      expect(service).toBeTruthy();
    });

    it('should setup dashboardVm$ to return expected initial values', () => {
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );

      service.dashboardVm$.subscribe((vm) => {
        expect(vm.error).toEqual('');
        expect(vm.isLoading).toBeFalsy();
        expect(vm.isReadyForSearch).toBeFalsy();
        expect(vm.totalTimeTaken).toEqual(0);
      });
    });

    it('should set isLoading to true when setLoadingFlag is called with true', () => {
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );

      service.setLoadingFlag(true);

      service.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBeTruthy();
      });
    });

    it('should set isLoading to false when setLoadingFlag is called with false', () => {
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );

      service.setLoadingFlag(false);

      service.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBeFalsy();
      });
    });

    it('should set correct initial state when initializeAppData() is called', fakeAsync(() => {
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );

      planetServiceMock.getAllPlanets.mockReturnValue(
        of(planetListToBeReturned, asyncScheduler)
      );
      vehiclesServiceMock.getAllVehicles.mockReturnValue(
        of(vehicleListToBeReturned, asyncScheduler)
      );
      tokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
        of(apiTokenToBeReturned, asyncScheduler)
      );

      service.initializeAppData();

      tick();

      service['store$'].subscribe((state) => {
        expect(state.errorMsg).toEqual('');
        expect(state.isLoading).toBeFalsy();
        expect(state.isReadyToSearch).toBeFalsy();
        expect(state.totalTimeTaken).toEqual(0);
        expect(state.planetList).toEqual(planetListToBeReturned);
        expect(state.vehicleList).toEqual(vehicleListToBeReturned);
        expect(state.unsearchedPlanets).toEqual(planetListToBeReturned);
        expect(state.vehicleInventory).toEqual(vehicleListToBeReturned);

        expect(state.searchMap.size).toEqual(4);
        expect(state.searchMap.get('1').searchedPlanet).toEqual(undefined);
        expect(state.searchMap.get('1').vehicleUsed).toEqual(undefined);
      });
    }));

    it('should expect router.navigate(["reset"]) to be called when resetApp is called', () => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );

      // act
      service.resetApp();

      // assert
      expect(routerServiceMock.navigate.mock.calls.length).toEqual(1);
      expect(routerServiceMock.navigate.mock.calls[0][0]).toEqual(['reset']);
    });
  });

  describe('Planet and Vehicle Changes Tests', () => {
    let expectedState: IFalconAppState;
    let searchAttemptMap: Map<string, ISearchAttempt>;
    let availablePlanetListMap: Map<string, IPlanet[]>;
    let availableVehicleListMap: Map<string, IVehicle[]>;

    beforeEach(() => {
      searchAttemptMap = new Map<string, ISearchAttempt>([
        ['1', { searchedPlanet: null, vehicleUsed: null } as ISearchAttempt],
        ['2', { searchedPlanet: null, vehicleUsed: null } as ISearchAttempt],
        ['3', { searchedPlanet: null, vehicleUsed: null } as ISearchAttempt],
        ['4', { searchedPlanet: null, vehicleUsed: null } as ISearchAttempt],
      ]);

      availablePlanetListMap = new Map<string, IPlanet[]>([
        ['1', planetListToBeReturned],
        ['2', planetListToBeReturned],
        ['3', planetListToBeReturned],
        ['4', planetListToBeReturned],
      ]);

      availableVehicleListMap = new Map<string, IVehicle[]>([
        ['1', vehicleListToBeReturned],
        ['2', vehicleListToBeReturned],
        ['3', vehicleListToBeReturned],
        ['4', vehicleListToBeReturned],
      ]);

      expectedState = {
        errorMsg: '',
        isLoading: false,
        planetList: planetListToBeReturned,
        searchMap: searchAttemptMap,
        unsearchedPlanets: planetListToBeReturned,
        vehicleInventory: vehicleListToBeReturned,
        totalTimeTaken: 0,
        vehicleList: vehicleListToBeReturned,
        isReadyToSearch: false,
      };

      planetServiceMock.getAllPlanets.mockReturnValue(
        of(planetListToBeReturned, asyncScheduler)
      );
      vehiclesServiceMock.getAllVehicles.mockReturnValue(
        of(vehicleListToBeReturned, asyncScheduler)
      );
      tokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
        of(apiTokenToBeReturned, asyncScheduler)
      );
    });

    it('should set expected state when a planet is set for the first time', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      const newPlanet = 'Donlon';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: null,
      } as ISearchAttempt);
      const filteredPlanetList = planetListToBeReturned.filter(
        (p) => p.name !== newPlanet
      );
      expectedState.unsearchedPlanets = filteredPlanetList;

      // act
      service.planetChanged(new PlanetChange(1, newPlanet));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should set expected state when a vehicle is set for the first time', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      const newPlanet = 'Donlon';
      const newVehicle = 'Space pod';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: null,
      } as ISearchAttempt);
      const filteredPlanetList = planetListToBeReturned.filter(
        (p) => p.name !== newPlanet
      );

      expectedState.unsearchedPlanets = filteredPlanetList;
      expectedState.totalTimeTaken = 50;

      service.planetChanged(new PlanetChange(1, newPlanet));

      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      const updatedVehicleList = [
        {
          name: 'Space pod',
          availNumUnits: 1,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 1,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 1,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      expectedState.vehicleInventory = updatedVehicleList;
      // act
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      // assert
      expect(service['_state']).toEqual(expectedState);
      (expect(service['_state']) as any).toMatchSnapshot();
    }));

    it('should set expected state when vehicle is changed in the first widget', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      const newPlanet = 'Donlon';
      let newVehicle = 'Space pod';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: null,
      } as ISearchAttempt);
      const filteredPlanetList = planetListToBeReturned.filter(
        (p) => p.name !== newPlanet
      );

      expectedState.unsearchedPlanets = filteredPlanetList;
      expectedState.totalTimeTaken = 10;

      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      newVehicle = 'Space ship';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      const filteredVehicleList = [
        {
          name: 'Space pod',
          availNumUnits: 2,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 1,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 1,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 1,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      expectedState.vehicleInventory = filteredVehicleList;

      // act
      service.vehicleChanged(new VehicleChange(1, 'Space ship'));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should set isReadyForSearch to true when all widgets are set with required inputs', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;

      expectedState.unsearchedPlanets = [];
      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 0,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 0,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 0,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      // set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      // set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('2', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      // set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      expectedState.searchMap.set('3', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      // set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      expectedState.searchMap.set('4', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);

      // act
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right when 1st widget planet is updated', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 0;
      expectedState.isReadyToSearch = false;

      const availableVehicleList = [
        {
          name: 'Space pod',
          availNumUnits: 2,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 1,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 1,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      expectedState.unsearchedPlanets = [
        { name: 'Donlon', distance: 100 },
        { name: 'Jebing', distance: 300 },
        { name: 'Sapir', distance: 400 },
      ];
      expectedState.vehicleInventory = availableVehicleList;

      // set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      // set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      // set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      // set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      // act
      // update planet in first widget
      newPlanet = 'Enchai';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.searchMap.set('2', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.searchMap.set('3', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.searchMap.set('4', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(1, newPlanet));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right when 1st widget vehicle is updated', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 25;
      expectedState.isReadyToSearch = false;

      const availableVehicleList = [
        {
          name: 'Space pod',
          availNumUnits: 2,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 0,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 1,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      // set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      // set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      // set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      // set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      // act
      // update vehicle in first widget
      newPlanet = 'Donlon';
      newVehicle = 'Space rocket';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      expectedState.searchMap.set('2', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.searchMap.set('3', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.searchMap.set('4', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.unsearchedPlanets = [
        { name: 'Enchai', distance: 200 },
        { name: 'Jebing', distance: 300 },
        { name: 'Sapir', distance: 400 },
      ];

      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 2,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 0,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 1,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];
      service.vehicleChanged(new VehicleChange(1, newVehicle));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right (but not the 1st and 2nd widget) when 3rd widget planet is updated', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 150;
      expectedState.isReadyToSearch = false;

      expectedState.unsearchedPlanets = [{ name: 'Jebing', distance: 300 }];
      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 0,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 1,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 1,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];
      // set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      // set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('2', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      // set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      // set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      expectedState.searchMap.set('3', {
        searchedPlanet: newPlanet,
        vehicleUsed: null,
      } as ISearchAttempt);
      expectedState.searchMap.set('4', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);

      // act
      // updated planet for 3rd widget
      newPlanet = 'Sapir';
      service.planetChanged(new PlanetChange(3, newPlanet));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should reset widgets to the right (but not the 1st and 2nd widget) when 3rd widget vehicle is updated', fakeAsync(() => {
      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        tokenServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 210;
      expectedState.isReadyToSearch = false;

      expectedState.unsearchedPlanets = [{ name: 'Sapir', distance: 400 }];

      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 0,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 1,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 0,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];
      // set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('1', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      // set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('2', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      // set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      // set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      newPlanet = 'Jebing';
      newVehicle = 'Space shuttle';
      expectedState.searchMap.set('3', {
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      } as ISearchAttempt);
      expectedState.searchMap.set('4', {
        searchedPlanet: null,
        vehicleUsed: null,
      } as ISearchAttempt);

      // act
      // updated planet for 3rd widget

      service.vehicleChanged(new VehicleChange(3, newVehicle));

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));
  });

  /*describe('FindFalcone api Tests', () => {
    let expectedState: IFalconAppState;
    let searchAttemptMap: Map<string, ISearchAttempt>;
    let availablePlanetListMap: Map<string, IPlanet[]>;
    let availableVehicleListMap: Map<string, IVehicle[]>;

    beforeEach(() => {
      searchAttemptMap = new Map<string, ISearchAttempt>([
        ['1', <ISearchAttempt>{ searchedPlanet: null, vehicleUsed: null }],
        ['2', <ISearchAttempt>{ searchedPlanet: null, vehicleUsed: null }],
        ['3', <ISearchAttempt>{ searchedPlanet: null, vehicleUsed: null }],
        ['4', <ISearchAttempt>{ searchedPlanet: null, vehicleUsed: null }],
      ]);

      expectedState = {
        errorMsg: '',
        isLoading: false,
        planetList: planetListToBeReturned,
        unsearchedPlanets: planetListToBeReturned,
        vehicleInventory: vehicleListToBeReturned,
        searchMap: searchAttemptMap,
        totalTimeTaken: 0,
        vehicleList: vehicleListToBeReturned,
        isReadyToSearch: false,
      };

      planetServiceMock.getAllPlanets.mockReturnValue(
        of(planetListToBeReturned, asyncScheduler)
      );
      vehiclesServiceMock.getAllVehicles.mockReturnValue(
        of(vehicleListToBeReturned, asyncScheduler)
      );
      falconFinderServiceMock.getFalconFinderApiToken.mockReturnValue(
        of(apiTokenToBeReturned, asyncScheduler)
      );
    });

    it('should have  name of planet falcon was found on, when falcon is found', fakeAsync(() => {
      const findFalconApiResponse = <IFindFalconResponse>{
        error: '',
        planetName: 'Donlon',
        status: 'success',
      };

      falconFinderServiceMock.findFalcon.mockReturnValue(
        of(findFalconApiResponse, asyncScheduler)
      );

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        falconFinderServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;

      //set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('1', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      //set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('2', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      //set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      expectedState.searchMap.set('3', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      //set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      expectedState.searchMap.set('4', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      expectedState.unsearchedPlanets = [];
      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 0,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 0,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 0,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];
      // act
      service.findFalcon();
      tick();

      // assert
      expect(service['_state']).toEqual(expectedState);
      service.planetFoundOn$.subscribe((planetFoundOn) => {
        expect(planetFoundOn).toEqual('Donlon');
      });
    }));

    it('should set in state, error message for not being able to find falcon, when falcon is not found', fakeAsync(() => {
      const findFalconApiResponse = <IFindFalconResponse>{
        error: '',
        planetName: '',
        status: 'false',
      };

      falconFinderServiceMock.findFalcon.mockReturnValue(
        of(findFalconApiResponse, asyncScheduler)
      );

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        falconFinderServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;

      //set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('1', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      //set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('2', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      //set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      expectedState.searchMap.set('3', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      //set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      expectedState.searchMap.set('4', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      expectedState.unsearchedPlanets = [];
      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 0,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 0,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 0,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      expectedState.errorMsg =
        'Failure! You were unable to find Falcone. Better luck next time.';

      // act
      service.findFalcon();
      tick();

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));

    it('should set in state, error message when falcon api returns error message', fakeAsync(() => {
      const findFalconApiResponse = <IFindFalconResponse>{
        error: 'Invalid Request',
        planetName: '',
        status: 'false',
      };

      falconFinderServiceMock.findFalcon.mockReturnValue(
        of(findFalconApiResponse, asyncScheduler)
      );

      // arrange
      const service: FinderFacadeService = new FinderFacadeService(
        planetServiceMock,
        vehiclesServiceMock,
        falconFinderServiceMock,
        routerServiceMock
      );
      service.initializeAppData();
      tick();
      let newPlanet: string;
      let newVehicle: string;

      expectedState.lastUpdatedWidgetId = 4;
      expectedState.totalTimeTaken = 305;
      expectedState.isReadyToSearch = true;

      //set first widet
      newPlanet = 'Donlon';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('1', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(1, newPlanet));
      service.vehicleChanged(new VehicleChange(1, 'Space pod'));

      //set 2nd widget
      newPlanet = 'Enchai';
      newVehicle = 'Space pod';
      expectedState.searchMap.set('2', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(2, newPlanet));
      service.vehicleChanged(new VehicleChange(2, newVehicle));

      //set 3rd widget
      newPlanet = 'Jebing';
      newVehicle = 'Space rocket';
      expectedState.searchMap.set('3', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(3, newPlanet));
      service.vehicleChanged(new VehicleChange(3, newVehicle));

      //set 4th widget
      newPlanet = 'Sapir';
      newVehicle = 'Space shuttle';
      expectedState.searchMap.set('4', <ISearchAttempt>{
        searchedPlanet: newPlanet,
        vehicleUsed: newVehicle,
      });
      service.planetChanged(new PlanetChange(4, newPlanet));
      service.vehicleChanged(new VehicleChange(4, newVehicle));

      expectedState.unsearchedPlanets = [];
      expectedState.vehicleInventory = [
        {
          name: 'Space pod',
          availNumUnits: 0,
          maxDistance: 200,
          speed: 2,
          totalNumUnits: 2,
        },
        {
          name: 'Space rocket',
          availNumUnits: 0,
          maxDistance: 300,
          speed: 4,
          totalNumUnits: 1,
        },
        {
          name: 'Space shuttle',
          availNumUnits: 0,
          maxDistance: 400,
          speed: 5,
          totalNumUnits: 1,
        },
        {
          name: 'Space ship',
          availNumUnits: 2,
          maxDistance: 600,
          speed: 10,
          totalNumUnits: 2,
        },
      ];

      expectedState.errorMsg = 'Invalid Request';

      // act
      service.findFalcon();
      tick();

      // assert
      expect(service['_state']).toEqual(expectedState);
    }));
  });*/
});
