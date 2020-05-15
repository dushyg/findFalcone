import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';

import { FinderBoardComponent } from './finder-board.component';
import { createSpyObj } from 'src/app/testingUtitlity';
import { PlanetsService } from 'src/app/finder-board/services/planets.service';
import { VehiclesService } from 'src/app/finder-board/services/vehicles.service';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { FalconeTokenService } from '../../services/falcone-token.service';
import { By } from '@angular/platform-browser';
import { DestinationWidgetListComponent } from '../../presenterComponents/destination-widget-list/destination-widget-list.component';
import { of } from 'rxjs';
import { DestinationWidgetComponent } from '../destination-widget/destination-widget.component';
import { TypeaheadComponent } from '../../presenterComponents/typeahead/typeahead.component';
import { VehicleListComponent } from '../vehicle-list/vehicle-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPlanet, IVehicle } from '../../models';

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
      declarations: [
        FinderBoardComponent,
        DestinationWidgetListComponent,
        DestinationWidgetComponent,
        VehicleListComponent,
        TypeaheadComponent,
      ],
      providers: [
        FinderFacadeService,
        { provide: PlanetsService, useValue: planetServiceMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: FalconeTokenService, useValue: apiTokenServiceMock },
        { provide: Router, useValue: routerServiceMock },
      ],
      imports: [FormsModule, ReactiveFormsModule],
      // schemas: [NO_ERRORS_SCHEMA],
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
    DestinationWidgetComponent.prototype.widgetId = 0;
    fixture = TestBed.createComponent(FinderBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    (expect(fixture) as any).toMatchSnapshot();
  });

  it('should render time taken with initial value of 0', () => {
    fixture.detectChanges();
    const divTimeTaken = fixture.debugElement.query(By.css('.timeTaken'))
      .nativeElement as HTMLElement;
    expect(divTimeTaken).toBeTruthy();
    expect(divTimeTaken.textContent.includes('Time Taken : 0'));
  });

  it('should render app-destination-widget-list', () => {
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
    fixture.detectChanges();
    const findButton = fixture.debugElement.query(
      By.css('div.findButtonContainer input[type=button]:disabled')
    );
    expect(findButton).toBeTruthy();
  });

  it('should start with time taken as 0', () => {
    fixture.detectChanges();

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 0`);
  });

  it('should not change time taken when first planet is selected', () => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    const widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );

    fixture.detectChanges();

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 0`);
  });

  it('should set correct time taken when first vehicle is selected', () => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    const widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );

    fixture.detectChanges();

    const vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 50`);
  });

  it('should enable find button if all widgets are set with required info', () => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    //#region setup first widget
    // find and set planet as Donlon in first widget
    const widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in first widget
    let vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup first widget

    //#region setup 2nd widget
    // find and set planet as Enchai in 2nd widget
    const widget2TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      2
    );
    expect(widget2TypeAheadDE).toBeTruthy();
    (widget2TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Enchai'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in 2nd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget2VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      2
    );
    expect(widget2VehicleListDE).toBeTruthy();

    (widget2VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 2nd widget

    //#region setup 3rd widget
    // find and set planet as Jebing in 3rd widget
    const widget3TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      3
    );
    expect(widget3TypeAheadDE).toBeTruthy();
    (widget3TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Jebing'
    );
    fixture.detectChanges();

    // find and set vehicle Space rocket in 3rd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget3VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      3
    );
    expect(widget3VehicleListDE).toBeTruthy();

    (widget3VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space rocket',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 3rd widget

    //#region setup 4th widget
    // find and set planet as Sapir in 4th widget
    const widget4TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      4
    );
    expect(widget4TypeAheadDE).toBeTruthy();
    (widget4TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Sapir'
    );
    fixture.detectChanges();

    // find and set vehicle Space shuttle in 4th widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget4VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      4
    );
    expect(widget4VehicleListDE).toBeTruthy();

    (widget4VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space shuttle',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 4th widget

    //#region assert button is enabled
    const findButton = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();
    expect(findButton.disabled).toBeFalsy();
    //#endregion assert button is enabled

    //#region assert correct time taken

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 305`);
    //#endregion assert correct time taken

    //#region commented code
    // set planet Donlon and vehicle space pod
    // const widget1TypeAhead = fixture.nativeElement.querySelector(
    //   'div.destinationWidget[widgetId="1"] input.typeAhead[type=text]'
    // );

    // widget1TypeAhead.
    // const widget1VehicleListLIs = fixture.nativeElement.querySelector(
    //   'div.destinationWidget[widgetId="1"] div.vehicleList input[type=radio]'
    // );
    //#endregion
  });

  it('should reset its vehicle when first widgets planet is changed', () => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    //#region setup first widget
    // find and set planet as Donlon in first widget
    let widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in first widget
    let vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    let widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup first widget

    //#region setup 2nd widget
    // find and set planet as Enchai in 2nd widget
    const widget2TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      2
    );
    expect(widget2TypeAheadDE).toBeTruthy();
    (widget2TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Enchai'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in 2nd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget2VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      2
    );
    expect(widget2VehicleListDE).toBeTruthy();

    (widget2VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 2nd widget

    //#region setup 3rd widget
    // find and set planet as Jebing in 3rd widget
    const widget3TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      3
    );
    expect(widget3TypeAheadDE).toBeTruthy();
    (widget3TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Jebing'
    );
    fixture.detectChanges();

    // find and set vehicle Space rocket in 3rd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget3VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      3
    );
    expect(widget3VehicleListDE).toBeTruthy();

    (widget3VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space rocket',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 3rd widget

    //#region setup 4th widget
    // find and set planet as Sapir in 4th widget
    const widget4TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      4
    );
    expect(widget4TypeAheadDE).toBeTruthy();
    (widget4TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Sapir'
    );
    fixture.detectChanges();

    // find and set vehicle Space shuttle in 4th widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget4VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      4
    );
    expect(widget4VehicleListDE).toBeTruthy();

    (widget4VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space shuttle',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 4th widget

    //#region change first widget's planet
    widget1TypeAheadDE = getDebugElementByWidgetId(typeAheadDebugElements, 1);
    expect(widget1TypeAheadDE).toBeTruthy();
    const widget1TypeaheadComponent = widget1TypeAheadDE.componentInstance as TypeaheadComponent;
    const widget1TypeaheadInputTextBox = widget1TypeAheadDE.query(
      By.css('input[type=text]')
    ).nativeElement;

    widget1TypeaheadInputTextBox.dispatchEvent(new Event('focus'));
    widget1TypeaheadInputTextBox.value = '';
    widget1TypeaheadInputTextBox.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    widget1TypeaheadComponent.planetSelectHandler('Enchai');
    fixture.detectChanges();
    //#endregion change first widget's planet

    //#region assert first widget's vehicle is reset
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    expect(
      (widget1VehicleListDE.componentInstance as VehicleListComponent)
        .lastSelectedVehicle.name
    ).toBeFalsy();
    //#endregion

    //#region  assert widgets to the right are reset

    //#endregion  assert widgets to the right are reset

    //#region assert button is disabled
    const findButton = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();
    expect(findButton.disabled).toBeTruthy();
    //#endregion assert button is disabled

    //#region assert correct time taken

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 0`);
    //#endregion assert correct time taken
  });

  it('should not reset widgets to the left when 3rd widget planet is changed', fakeAsync(() => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    //#region setup first widget
    // find and set planet as Donlon in first widget
    const widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in first widget
    let vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();

    // call to flush is requred before setting up next widgets planet so that
    // reset method in typeahead component clears the widgets to the right before
    // those widgets are set up.
    // In earlier test cases we were not calling flush, because we were
    // not reading contents of the textboxes as part of our assertions
    flush();
    //#endregion setup first widget

    //#region setup 2nd widget
    // find and set planet as Enchai in 2nd widget
    const widget2TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      2
    );
    expect(widget2TypeAheadDE).toBeTruthy();
    (widget2TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Enchai'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in 2nd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget2VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      2
    );
    expect(widget2VehicleListDE).toBeTruthy();

    (widget2VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    flush();
    //#endregion setup 2nd widget

    //#region setup 3rd widget
    // find and set planet as Jebing in 3rd widget
    let widget3TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      3
    );
    expect(widget3TypeAheadDE).toBeTruthy();
    (widget3TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Jebing'
    );
    fixture.detectChanges();

    // find and set vehicle Space rocket in 3rd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget3VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      3
    );
    expect(widget3VehicleListDE).toBeTruthy();

    (widget3VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space rocket',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    flush();
    //#endregion setup 3rd widget

    //#region setup 4th widget
    // find and set planet as Sapir in 4th widget
    const widget4TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      4
    );
    expect(widget4TypeAheadDE).toBeTruthy();
    (widget4TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Sapir'
    );
    fixture.detectChanges();

    // find and set vehicle Space shuttle in 4th widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget4VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      4
    );
    expect(widget4VehicleListDE).toBeTruthy();

    (widget4VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space shuttle',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    flush();
    //#endregion setup 4th widget

    //#region change 3rd widget's planet
    widget3TypeAheadDE = getDebugElementByWidgetId(typeAheadDebugElements, 3);
    expect(widget3TypeAheadDE).toBeTruthy();
    const widget3TypeaheadComponent = widget3TypeAheadDE.componentInstance as TypeaheadComponent;
    const widget3TypeaheadInputTextBox = widget3TypeAheadDE.query(
      By.css('input[type=text]')
    ).nativeElement;

    widget3TypeaheadInputTextBox.value = '';
    widget3TypeaheadInputTextBox.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    widget3TypeaheadComponent.planetSelectHandler('Sapir');

    fixture.detectChanges();
    flush();

    //#endregion change 3rd widget's planet

    //#region assert widgets to the left are not reset

    for (let widgetId = 1; widgetId <= 2; widgetId++) {
      //#region assert planet is not reset
      const typeAheadInput: HTMLInputElement = fixture.nativeElement.querySelector(
        `#typeahead_input_widget_${widgetId}`
      );
      expect(typeAheadInput.value).toBeTruthy();
      //#endregion assert planet is not reset

      //#region assert selected vehicle is not reset, i.e vehicle radio is selected
      const vehicleRadioBtn: HTMLInputElement = fixture.nativeElement.querySelector(
        `#vehicle_${widgetId}_0`
      );
      expect(vehicleRadioBtn.checked).toBeTruthy();

      //#endregion assert selected vehicle is not reset, i.e vehicle radio is selected
    }

    //#endregion  assert widgets to the left are not reset

    //#region assert button is disabled
    const findButton = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();
    expect(findButton.disabled).toBeTruthy();
    //#endregion assert button is disabled

    //#region assert correct time taken

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 150`);
    //#endregion assert correct time taken
  }));

  it('should not reset widgets to the left when 3rd widget planet is changed', fakeAsync(() => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    //#region setup first widget
    // find and set planet as Donlon in first widget
    const widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in first widget
    let vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();

    // call to flush is requred before setting up next widgets planet so that
    // reset method in typeahead component clears the widgets to the right before
    // those widgets are set up.
    // In earlier test cases we were not calling flush, because we were
    // not reading contents of the textboxes as part of our assertions
    flush();
    //#endregion setup first widget

    //#region setup 2nd widget
    // find and set planet as Enchai in 2nd widget
    const widget2TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      2
    );
    expect(widget2TypeAheadDE).toBeTruthy();
    (widget2TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Enchai'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in 2nd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget2VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      2
    );
    expect(widget2VehicleListDE).toBeTruthy();

    (widget2VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    flush();
    //#endregion setup 2nd widget

    //#region setup 3rd widget
    // find and set planet as Jebing in 3rd widget
    const widget3TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      3
    );
    expect(widget3TypeAheadDE).toBeTruthy();
    (widget3TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Jebing'
    );
    fixture.detectChanges();

    // find and set vehicle Space rocket in 3rd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget3VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      3
    );
    expect(widget3VehicleListDE).toBeTruthy();

    (widget3VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space rocket',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    flush();
    //#endregion setup 3rd widget

    //#region setup 4th widget
    // find and set planet as Sapir in 4th widget
    const widget4TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      4
    );
    expect(widget4TypeAheadDE).toBeTruthy();
    (widget4TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Sapir'
    );
    fixture.detectChanges();

    // find and set vehicle Space shuttle in 4th widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget4VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      4
    );
    expect(widget4VehicleListDE).toBeTruthy();

    (widget4VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space shuttle',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    flush();
    //#endregion setup 4th widget

    //#region change 3rd widget's planet
    const widget3SpaceShuttleRadioButton: HTMLInputElement = fixture.nativeElement.querySelector(
      '#vehicle_3_2'
    );
    widget3SpaceShuttleRadioButton.click();
    flush();
    fixture.detectChanges();
    //#endregion change 3rd widget's planet

    //#region assert widgets to the left are not reset

    for (let widgetId = 1; widgetId <= 2; widgetId++) {
      //#region assert planet is not reset
      const typeAheadInput: HTMLInputElement = fixture.nativeElement.querySelector(
        `#typeahead_input_widget_${widgetId}`
      );
      expect(typeAheadInput.value).toBeTruthy();
      //#endregion assert planet is not reset

      //#region assert selected vehicle is not reset, i.e vehicle radio is selected
      const vehicleRadioBtn: HTMLInputElement = fixture.nativeElement.querySelector(
        `#vehicle_${widgetId}_0`
      );
      expect(vehicleRadioBtn.checked).toBeTruthy();

      //#endregion assert selected vehicle is not reset, i.e vehicle radio is selected
    }

    //#endregion  assert widgets to the left are not reset

    //#region assert button is disabled
    const findButton = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();
    expect(findButton.disabled).toBeTruthy();
    //#endregion assert button is disabled

    //#region assert correct time taken

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 210`);
    //#endregion assert correct time taken
  }));

  it('should reset all widgets to the right of first widget when first widget planet is changed', fakeAsync(() => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    //#region setup first widget
    // find and set planet as Donlon in first widget
    let widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in first widget
    let vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    let widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup first widget

    //#region setup 2nd widget
    // find and set planet as Enchai in 2nd widget
    const widget2TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      2
    );
    expect(widget2TypeAheadDE).toBeTruthy();
    (widget2TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Enchai'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in 2nd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget2VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      2
    );
    expect(widget2VehicleListDE).toBeTruthy();

    (widget2VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 2nd widget

    //#region setup 3rd widget
    // find and set planet as Jebing in 3rd widget
    const widget3TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      3
    );
    expect(widget3TypeAheadDE).toBeTruthy();
    (widget3TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Jebing'
    );
    fixture.detectChanges();

    // find and set vehicle Space rocket in 3rd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget3VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      3
    );
    expect(widget3VehicleListDE).toBeTruthy();

    (widget3VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space rocket',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 3rd widget

    //#region setup 4th widget
    // find and set planet as Sapir in 4th widget
    const widget4TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      4
    );
    expect(widget4TypeAheadDE).toBeTruthy();
    (widget4TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Sapir'
    );
    fixture.detectChanges();

    // find and set vehicle Space shuttle in 4th widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget4VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      4
    );
    expect(widget4VehicleListDE).toBeTruthy();

    (widget4VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space shuttle',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 4th widget

    //#region change first widget's planet
    widget1TypeAheadDE = getDebugElementByWidgetId(typeAheadDebugElements, 1);
    expect(widget1TypeAheadDE).toBeTruthy();
    const widget1TypeaheadComponent = widget1TypeAheadDE.componentInstance as TypeaheadComponent;
    const widget1TypeaheadInputTextBox = widget1TypeAheadDE.query(
      By.css('input[type=text]')
    ).nativeElement;

    widget1TypeaheadInputTextBox.value = '';
    widget1TypeaheadInputTextBox.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    widget1TypeaheadComponent.planetSelectHandler('Enchai');
    fixture.detectChanges();
    flush();
    //#endregion change first widget's planet

    //#region assert first widget's vehicle is reset
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    expect(
      (widget1VehicleListDE.componentInstance as VehicleListComponent)
        .lastSelectedVehicle.name
    ).toBeFalsy();
    //#endregion

    //#region  assert widgets to the right are reset

    for (let widgetId = 2; widgetId <= 4; widgetId++) {
      //#region assert planet is reset
      const typeAheadInput: HTMLInputElement = fixture.nativeElement.querySelector(
        `#typeahead_input_widget_${widgetId}`
      );
      expect(typeAheadInput.value).toBeFalsy();
      //#endregion assert planet is reset

      //#region assert selected vehicle is reset, i.e no vehicle radio is selected
      const vehicleListRadioBtns: HTMLInputElement[] = fixture.nativeElement.querySelectorAll(
        `input[type=radio][id^=vehicle_${widgetId}`
      );
      vehicleListRadioBtns.forEach((radio) => {
        expect(radio.checked).toBeFalsy();
      });
      //#endregion assert selected vehicle is reset, i.e no vehicle radio is selected
    }

    //#endregion  assert widgets to the right are reset

    //#region assert button is disabled
    const findButton = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();
    expect(findButton.disabled).toBeTruthy();
    //#endregion assert button is disabled

    //#region assert correct time taken

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 0`);
    //#endregion assert correct time taken
  }));

  it('should reset all widgets to the right of first widget when first widget vehicle is changed', fakeAsync(() => {
    fixture.detectChanges();

    const typeAheadDebugElements = fixture.debugElement.queryAll(
      By.directive(TypeaheadComponent)
    );
    expect(typeAheadDebugElements).toBeTruthy();

    //#region setup first widget
    // find and set planet as Donlon in first widget
    const widget1TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      1
    );
    expect(widget1TypeAheadDE).toBeTruthy();
    (widget1TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Donlon'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in first widget
    let vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget1VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      1
    );
    expect(widget1VehicleListDE).toBeTruthy();

    (widget1VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup first widget

    //#region setup 2nd widget
    // find and set planet as Enchai in 2nd widget
    const widget2TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      2
    );
    expect(widget2TypeAheadDE).toBeTruthy();
    (widget2TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Enchai'
    );
    fixture.detectChanges();

    // find and set vehicle Space pod in 2nd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget2VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      2
    );
    expect(widget2VehicleListDE).toBeTruthy();

    (widget2VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space pod',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 2nd widget

    //#region setup 3rd widget
    // find and set planet as Jebing in 3rd widget
    const widget3TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      3
    );
    expect(widget3TypeAheadDE).toBeTruthy();
    (widget3TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Jebing'
    );
    fixture.detectChanges();

    // find and set vehicle Space rocket in 3rd widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget3VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      3
    );
    expect(widget3VehicleListDE).toBeTruthy();

    (widget3VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space rocket',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 3rd widget

    //#region setup 4th widget
    // find and set planet as Sapir in 4th widget
    const widget4TypeAheadDE = getDebugElementByWidgetId(
      typeAheadDebugElements,
      4
    );
    expect(widget4TypeAheadDE).toBeTruthy();
    (widget4TypeAheadDE.componentInstance as TypeaheadComponent).planetSelectHandler(
      'Sapir'
    );
    fixture.detectChanges();

    // find and set vehicle Space shuttle in 4th widget
    vehicleListDebugElements = fixture.debugElement.queryAll(
      By.directive(VehicleListComponent)
    );
    expect(vehicleListDebugElements).toBeTruthy();

    const widget4VehicleListDE = getDebugElementByWidgetId(
      vehicleListDebugElements,
      4
    );
    expect(widget4VehicleListDE).toBeTruthy();

    (widget4VehicleListDE.componentInstance as VehicleListComponent).vehicleSelected(
      {
        name: 'Space shuttle',
        availNumUnits: 0,
        maxDistance: 0,
        speed: 0,
        totalNumUnits: 0,
      }
    );
    fixture.detectChanges();
    //#endregion setup 4th widget

    //#region change first widget's vehicle
    const widget1SpaceRocketVehicle: HTMLInputElement = fixture.nativeElement.querySelector(
      '#vehicle_1_1'
    );
    widget1SpaceRocketVehicle.click();
    flush();
    fixture.detectChanges();

    //#endregion change first widget's vehicle

    //#region  assert widgets to the right are reset

    for (let widgetId = 2; widgetId <= 4; widgetId++) {
      //#region assert planet is reset
      const typeAheadInput: HTMLInputElement = fixture.nativeElement.querySelector(
        `#typeahead_input_widget_${widgetId}`
      );
      expect(typeAheadInput.value).toBeFalsy();
      //#endregion assert planet is reset

      //#region assert selected vehicle is reset, i.e no vehicle radio is selected
      const vehicleListRadioBtns: HTMLInputElement[] = fixture.nativeElement.querySelectorAll(
        `input[type=radio][id^=vehicle_${widgetId}`
      );
      vehicleListRadioBtns.forEach((radio) => {
        expect(radio.checked).toBeFalsy();
      });
      //#endregion assert selected vehicle is reset, i.e no vehicle radio is selected
    }

    //#endregion  assert widgets to the right are reset

    //#region assert button is disabled
    const findButton = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();
    expect(findButton.disabled).toBeTruthy();
    //#endregion assert button is disabled

    //#region assert correct time taken

    const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
    expect(divTimeTaken).toBeTruthy();

    expect(divTimeTaken.textContent).toBe(`Time Taken : 25`);
    //#endregion assert correct time taken
  }));

  it('should call router.navigate(["result"]) when enabled find button is clicked', () => {
    // arrange
    fixture.detectChanges();

    const findButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'div.findButtonContainer input[type=button]'
    );
    expect(findButton).toBeTruthy();

    findButton.disabled = false;
    const spy = jest.spyOn(routerServiceMock, 'navigate');

    // act
    findButton.click();

    // assert
    expect(spy).toHaveBeenCalledWith(['result']);
  });

  function getDebugElementByWidgetId(debugElements: DebugElement[], widgetId) {
    return debugElements.find(
      (de) => de.componentInstance.widgetId === widgetId
    );
  }
});
