import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderBoardComponent } from './finder-board.component';
import { IPlanet } from 'src/app/core/models/planet';
import { IVehicle } from 'src/app/core/models/vehicle';
import { createSpyObj } from 'src/app/core/utitlity';
import { PlanetsService } from 'src/app/core/planets.service';
import { VehiclesService } from 'src/app/core/vehicles.service';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Router } from '@angular/router';
import { FalconFinderService } from 'src/app/core/falcon-finder.service';
import { CommonModule } from '@angular/common';
import { FalconFinderRoutingModule } from 'src/app/features/falcon-finder-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinderBoardComponent', () => {
  let component: FinderBoardComponent;
  let fixture: ComponentFixture<FinderBoardComponent>;

  let planetServiceMock , vehiclesServiceMock , falconFinderServiceMock , routerServiceMock;
  let planetListToBeReturned : IPlanet[],  vehicleListToBeReturned : IVehicle[];
  const apiTokenToBeReturned : string = "plmVHX"; 

  beforeEach(() => {

    planetServiceMock = createSpyObj(['getAllPlanets']);     
    vehiclesServiceMock = createSpyObj(['getAllVehicles']);
    falconFinderServiceMock = createSpyObj(['getFalconFinderApiToken', 'findFalcon']);
    routerServiceMock = createSpyObj(['navigate']);
    
   

    TestBed.configureTestingModule({
      declarations: [ FinderBoardComponent ],
      providers: [
        FinderFacadeService,
        {provide : PlanetsService, useValue : planetServiceMock}, 
        {provide : VehiclesService, useValue : vehiclesServiceMock},
        {provide : FalconFinderService, useValue : falconFinderServiceMock},
        {provide : Router, useValue : routerServiceMock},
        ],
        schemas : [NO_ERRORS_SCHEMA]
    }).compileComponents();    
    
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
    
    fixture = TestBed.createComponent(FinderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});