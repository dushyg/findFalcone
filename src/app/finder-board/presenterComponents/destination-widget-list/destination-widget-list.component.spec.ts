import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationWidgetListComponent } from './destination-widget-list.component';
import { DestinationWidgetComponent } from '../../smartComponents/destination-widget/destination-widget.component';
import { createSpyObj } from '../../../testingUtility';
import { TypeaheadComponent } from '../typeahead/typeahead.component';
import { VehicleListComponent } from '../../smartComponents/vehicle-list/vehicle-list.component';
import { FinderFacadeService } from '../../services/finder-facade.service';
import { PlanetsService } from '../../services/planets.service';
import { VehiclesService } from '../../services/vehicles.service';
import { FalconeTokenService } from '../../services/falcone-token.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DestinationWidgetListComponent', () => {
  let component: DestinationWidgetListComponent;
  let fixture: ComponentFixture<DestinationWidgetListComponent>;
  let planetServiceMock: { [key: string]: jest.Mock<any, any> };
  let vehiclesServiceMock: { [key: string]: jest.Mock<any, any> };
  let apiTokenServiceMock: { [key: string]: jest.Mock<any, any> };
  let routerServiceMock: { [key: string]: jest.Mock<any, any> };

  const apiTokenToBeReturned = { token: 'plmVHX' };

  beforeEach(() => {
    planetServiceMock = createSpyObj(['getAllPlanets']);
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    apiTokenServiceMock = createSpyObj(['getFalconeFinderApiToken']);
    routerServiceMock = createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        DestinationWidgetListComponent,
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
    fixture = TestBed.createComponent(DestinationWidgetListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    (expect(fixture) as any).toMatchSnapshot();
  });
});
