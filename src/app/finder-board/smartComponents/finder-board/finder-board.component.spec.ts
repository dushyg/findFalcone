import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderBoardComponent } from './finder-board.component';
import { IPlanet } from 'src/app/finder-board/models/planet';
import { IVehicle } from 'src/app/finder-board/models/vehicle';
import { createSpyObj } from 'src/app/finder-board/utitlity';
import { PlanetsService } from 'src/app/finder-board/services/planets.service';
import { VehiclesService } from 'src/app/finder-board/services/vehicles.service';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FalconeTokenService } from '../../services/falconeToken.service';

describe('FinderBoardComponent', () => {
  let component: FinderBoardComponent;
  let fixture: ComponentFixture<FinderBoardComponent>;

  let planetServiceMock;
  let vehiclesServiceMock;
  let apiTokenServiceMock;
  let routerServiceMock;
  let planetListToBeReturned: IPlanet[];
  let vehicleListToBeReturned: IVehicle[];
  const apiTokenToBeReturned = 'plmVHX';

  beforeEach(() => {
    planetServiceMock = createSpyObj(['getAllPlanets']);
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    apiTokenServiceMock = createSpyObj(['getFalconeFinderApiToken']);
    routerServiceMock = createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [FinderBoardComponent],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
