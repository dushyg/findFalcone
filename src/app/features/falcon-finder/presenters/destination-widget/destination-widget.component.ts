import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { IPlanet } from 'src/app/core/models/planet';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';
import PlanetChange from 'src/app/core/models/planetChange';
import VehicleChange from 'src/app/core/models/vehicleChange';
import { Observable } from 'rxjs';
import PlanetUpdates from 'src/app/core/models/planetUpdates';
import VehicleUpdates from 'src/app/core/models/vehicleUpdates';

@Component({
  selector: 'app-destination-widget',
  templateUrl: './destination-widget.component.html'
})
export class DestinationWidgetComponent implements OnInit, OnChanges {
    
  @Input() public vehicleList : IVehicle[];
  @Input() public planetList : IPlanet[];
  @Input() public planetListChanged : number; 
  @Input() public vehicleListChanged : number;
  private initialPlanetList : IPlanet[];

  @Output() public onPlanetSelected  = new EventEmitter<PlanetChange>();
  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();  
  
  private static createdWidgetCount : number = 0;
  public destinationDistance : number = 0 ;  
  public widgetId : number; 
  public lastSelectedPlanet : string ;
  public defaultSelectedPlanet : string ;

  constructor() { 
    
    this.widgetId = DestinationWidgetComponent.createdWidgetCount++;

    this.lastSelectedPlanet = this.defaultSelectedPlanet = 'Select';

    console.log(this.widgetId);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    const planetListChange : SimpleChange = changes['planetListChanged'];    
    if(planetListChange){
        let widgetId = planetListChange.currentValue;
        this.updatePlanetList(widgetId);
    }

    const vehicleListChange : SimpleChange = changes['vehicleListChanged'];    
    if(vehicleListChange){
      let widgetId = vehicleListChange.currentValue;
      this.updatePlanetList(widgetId);
    }
  }

  updatePlanetList( widgetId ) {
        
    //If planet was changed in an earlier widget then reset the initialPlanetList to currently remaining planets list
    if(widgetId < this.widgetId) {

      this.setLatestPlanetList();
    }
  
  }

  ngOnInit(): void {
    console.log('destination-widget oninit -> this.planetList', this.planetList);

    if(this.planetList) {
      this.initialPlanetList = [...this.planetList];
    }          
  }

  public planetSelected(planetName: string) {

    console.log(planetName);

    let planet : IPlanet = this.initialPlanetList.find( p => p.name === planetName);
        
    this.destinationDistance = planet.distance;

    this.onPlanetSelected.emit(new PlanetChange(this.widgetId, {name : this.lastSelectedPlanet, distance : null, includedInSearch : false}, planet));

    this.lastSelectedPlanet = planetName;
  }

  public vehicleSelected(vehicleChange : VehicleChange) {
    console.log(JSON.stringify(vehicleChange));
    this.onVehicleSelected.emit(vehicleChange);
  }

  setLatestPlanetList() : void {
    this.initialPlanetList = [...this.planetList];
  }

}
