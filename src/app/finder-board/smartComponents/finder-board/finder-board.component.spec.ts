import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';

import { FinderBoardComponent } from './finder-board.component';
import { IPlanet } from 'src/app/finder-board/models/planet';
import { IVehicle } from 'src/app/finder-board/models/vehicle';
import { createSpyObj } from 'src/app/finder-board/utitlity';
import { PlanetsService } from 'src/app/finder-board/services/planets.service';
import { VehiclesService } from 'src/app/finder-board/services/vehicles.service';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FalconeTokenService } from '../../services/falcone-token.service';
import { By } from '@angular/platform-browser';
import { of, asyncScheduler } from 'rxjs';
import { DestinationWidgetListComponent } from '../../presenterComponents/destination-widget-list/destination-widget-list.component';

describe('FinderBoardComponent', () => {
  let component: FinderBoardComponent;
  let fixture: ComponentFixture<FinderBoardComponent>;

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
      declarations: [FinderBoardComponent, DestinationWidgetListComponent],
      providers: [
        FinderFacadeService,
        { provide: PlanetsService, useValue: planetServiceMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: FalconeTokenService, useValue: apiTokenServiceMock },
        { provide: Router, useValue: routerServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

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

    fixture = TestBed.createComponent(FinderBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render time taken with initial value of 0', () => {
    planetServiceMock.getAllPlanets.mockReturnValue(planetListToBeReturned);
    vehiclesServiceMock.getAllVehicles.mockReturnValue(vehicleListToBeReturned);
    apiTokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
      apiTokenToBeReturned
    );
    fixture.detectChanges();
    const divTimeTaken = fixture.debugElement.query(By.css('.timeTaken'))
      .nativeElement as HTMLElement;
    expect(divTimeTaken).toBeTruthy();
    expect(divTimeTaken.textContent.includes('Time Taken : 0'));
  });

  it('should render app-destination-widget-list', () => {
    planetServiceMock.getAllPlanets.mockReturnValue(planetListToBeReturned);
    vehiclesServiceMock.getAllVehicles.mockReturnValue(vehicleListToBeReturned);
    apiTokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
      apiTokenToBeReturned
    );

    fixture.detectChanges();

    const widgetList = fixture.debugElement.query(
      By.directive(DestinationWidgetListComponent)
    );

    expect(widgetList).toBeTruthy();
    expect(
      (widgetList.componentInstance as DestinationWidgetListComponent)
        .widgetCountIterator.length
    ).toBe(4);
  });

  it('should render disabled find button', () => {
    planetServiceMock.getAllPlanets.mockReturnValue(
      of(planetListToBeReturned, asyncScheduler)
    );
    vehiclesServiceMock.getAllVehicles.mockReturnValue(
      of(vehicleListToBeReturned, asyncScheduler)
    );
    apiTokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
      of(apiTokenToBeReturned, asyncScheduler)
    );
    fixture.detectChanges();
    const findButton = fixture.debugElement.query(
      By.css('div.findButtonContainer input[type=button]:disabled')
    );
    expect(findButton).toBeTruthy();
  });
});
