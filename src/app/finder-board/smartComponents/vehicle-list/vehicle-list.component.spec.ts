import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListComponent } from './vehicle-list.component';
import { IVehicle } from '../../models/vehicle';
import { createSpyObj } from '../../../testingUtility';
import { FinderFacadeService } from '../../services/finder-facade.service';
import { PlanetsService } from '../../services/planets.service';
import { VehiclesService } from '../../services/vehicles.service';
import { FalconeTokenService } from '../../services/falcone-token.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;

  let planetServiceMock: { [key: string]: jest.Mock<any, any> };
  let vehiclesServiceMock: { [key: string]: jest.Mock<any, any> };
  let apiTokenServiceMock: { [key: string]: jest.Mock<any, any> };
  let routerServiceMock: { [key: string]: jest.Mock<any, any> };

  let vehicleListToBeReturned: IVehicle[];
  const apiTokenToBeReturned = { token: 'plmVHX' };
  beforeEach(() => {
    planetServiceMock = createSpyObj(['getAllPlanets']);
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    apiTokenServiceMock = createSpyObj(['getFalconeFinderApiToken']);
    routerServiceMock = createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [VehicleListComponent],
      providers: [
        FinderFacadeService,
        { provide: PlanetsService, useValue: planetServiceMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: FalconeTokenService, useValue: apiTokenServiceMock },
        { provide: Router, useValue: routerServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

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
    const planetListToBeReturned = [
      { name: 'Donlon', distance: 100 },
      { name: 'Enchai', distance: 200 },
      { name: 'Jebing', distance: 300 },
      { name: 'Sapir', distance: 400 },
    ];
    planetServiceMock.getAllPlanets.mockReturnValue(of(planetListToBeReturned));
    vehiclesServiceMock.getAllVehicles.mockReturnValue(
      of(vehicleListToBeReturned)
    );
    apiTokenServiceMock.getFalconeFinderApiToken.mockReturnValue(
      of(apiTokenToBeReturned)
    );

    fixture = TestBed.createComponent(VehicleListComponent);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render radio buttons equal to number of vehicles', () => {
    fixture.componentRef.injector.get(FinderFacadeService).initializeAppData();
    fixture.detectChanges();

    const radioBtns = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type=radio]'
    );
    expect(radioBtns).toBeTruthy();
    expect(radioBtns.length).toBe(vehicleListToBeReturned.length);

    const nameSet = new Set<string>();
    component.vehicleList.forEach((v) => nameSet.add(v.name));
    radioBtns.forEach((radioBtn) => {
      expect(nameSet.has((radioBtn as HTMLInputElement).value)).toBeTruthy();
    });
    (expect(fixture) as any).toMatchSnapshot();
  });

  it('should render labels equal to number of vehicles', () => {
    fixture.componentRef.injector.get(FinderFacadeService).initializeAppData();
    component.widgetId = 1;
    component.destinationDistance = 100;
    fixture.detectChanges();

    const labels = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'label'
    );

    expect(labels).toBeTruthy();
    expect(labels.length).toBe(vehicleListToBeReturned.length);

    let index = 0;
    labels.forEach((label) => {
      const vehicleByIndex = component.vehicleList[index++];
      expect(label.textContent).toContain(
        `${vehicleByIndex.name} (${vehicleByIndex.availNumUnits})`
      );
    });
  });
});
