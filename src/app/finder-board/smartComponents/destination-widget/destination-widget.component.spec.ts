import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationWidgetComponent } from './destination-widget.component';
import { TypeaheadComponent } from '../../presenterComponents/typeahead/typeahead.component';
import { VehicleListComponent } from '../vehicle-list/vehicle-list.component';
import { createSpyObj } from '../../../testingUtility';
import { FinderFacadeService } from '../../services/finder-facade.service';
import { PlanetsService } from '../../services/planets.service';
import { VehiclesService } from '../../services/vehicles.service';
import { FalconeTokenService } from '../../services/falcone-token.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, Type, ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IPlanet, IVehicle } from '../../models';

describe('DestinationWidgetComponent', () => {
  let component: DestinationWidgetComponent;
  let fixture: ComponentFixture<DestinationWidgetComponent>;

  let planetServiceMock: { [key: string]: jest.Mock<any, any> };
  let vehiclesServiceMock: { [key: string]: jest.Mock<any, any> };
  let apiTokenServiceMock: { [key: string]: jest.Mock<any, any> };
  let routerServiceMock: { [key: string]: jest.Mock<any, any> };
  let planetListToBeReturned: IPlanet[];
  let vehicleListToBeReturned: IVehicle[];
  const apiTokenToBeReturned = { token: 'plmVHX' };
  beforeEach(() => {
    planetServiceMock = createSpyObj(['getAllPlanets']);
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    apiTokenServiceMock = createSpyObj(['getFalconeFinderApiToken']);
    routerServiceMock = createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        DestinationWidgetComponent,
        TypeaheadComponent,
        VehicleListComponent,
      ],
      providers: [
        FinderFacadeService,
        { provide: PlanetsService, useValue: planetServiceMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: FalconeTokenService, useValue: apiTokenServiceMock },
        { provide: Router, useValue: routerServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

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

    planetServiceMock.getAllPlanets.mockReturnValue(of(planetListToBeReturned));
    vehiclesServiceMock.getAllVehicles.mockReturnValue(
      of(vehicleListToBeReturned)
    );
    apiTokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
      of(apiTokenToBeReturned)
    );

    fixture = TestBed.createComponent(DestinationWidgetComponent);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render typeahead component', () => {
    fixture.detectChanges();
    const facadeService = fixture.componentRef.injector.get(
      FinderFacadeService
    );

    facadeService.initializeAppData();
    fixture.detectChanges();

    const typeAheadDebugElement = fixture.debugElement.query(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElement).toBeTruthy();

    const typeAheadComponent = typeAheadDebugElement.componentInstance as TypeaheadComponent;
    expect(typeAheadComponent.filteredSourceArray).toEqual(
      typeAheadComponent.sourceArray
    );

    expect(typeAheadComponent.doShowResults).toBeFalsy();
    expect(typeAheadComponent.inputTextControl.value).toBeFalsy();
  });

  it('should render vehicle list component when planet is selected', () => {
    fixture.detectChanges();
    const facadeService = fixture.componentRef.injector.get(
      FinderFacadeService
    );
    const injectedChangeDetector = fixture.componentRef.injector.get(
      ChangeDetectorRef as Type<ChangeDetectorRef>
    );

    facadeService.initializeAppData();
    component.planetSelected({ name: 'Donlon', distance: 100 });
    injectedChangeDetector.detectChanges();

    const vehicleListDebugElement = fixture.debugElement.query(
      By.directive(VehicleListComponent)
    );

    expect(vehicleListDebugElement).toBeTruthy();
    const vehicleListComponent = vehicleListDebugElement.componentInstance as VehicleListComponent;
    expect(vehicleListComponent.vehicleList === vehicleListToBeReturned);
    expect(vehicleListComponent.widgetId).toBe(component.widgetId);
    expect(vehicleListComponent.destinationDistance).toBe(
      component.destinationDistance
    );
    (expect(fixture) as any).toMatchSnapshot();
  });

  // it('should render vehicle list component when planet is selected', () => {
  //   // use this in beforeEach
  //   // fixture = TestBed.overrideComponent(DestinationWidgetComponent, {
  //   //   set: { host: { '(click)': 'dummy' } },
  //   // }).createComponent(DestinationWidgetComponent);

  //   fixture.detectChanges();
  //   const facadeService = fixture.componentRef.injector.get(
  //     FinderFacadeService
  //   );

  //   facadeService.initializeAppData();
  //   component.planetSelected({ name: 'Donlon', distance: 100 });

  //   // fake a click event so thta onpush component triggers change detection
  //   fixture.debugElement.triggerEventHandler('click', null);
  //   fixture.detectChanges();

  //   const vehicleListDebugElement = fixture.debugElement.query(
  //     By.directive(VehicleListComponent)
  //   );

  //   expect(vehicleListDebugElement).toBeTruthy();
  // });
});
