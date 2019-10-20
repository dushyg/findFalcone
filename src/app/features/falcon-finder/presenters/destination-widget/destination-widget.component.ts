import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { IPlanet } from 'src/app/core/models/planet';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';
import PlanetChange from 'src/app/core/models/planetChange';
import VehicleChange from 'src/app/core/models/vehicleChange';

@Component({
  selector: 'app-destination-widget',
  templateUrl: './destination-widget.component.html'
})
export class DestinationWidgetComponent implements OnInit {
    
  @Input() public vehicleList : IVehicle[];
  @Input() public planetList : IPlanet[];

  private initialPlanetList : IPlanet[];

  @Output() public onPlanetSelected  = new EventEmitter<PlanetChange>();
  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  private static createdWidgetCount : number = 0;
  public destinationDistance : number = 0 ;  
  public widgetId : number; 
  public lastSelectedPlanet : IPlanet = null;
  public dummyPlanet : IPlanet ;

  constructor() { 
    
    this.widgetId = DestinationWidgetComponent.createdWidgetCount++;
    // this.lastSelectedPlanet = <IPlanet>{
    //   name : 'Select',
    //   distance : 0
    // };

    console.log(this.widgetId);
  }
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   const planetListChange : SimpleChange = changes['planetList'];    
  //   if(planetListChange && planetListChange.currentValue.length > 0){
  //     this.planetListWithSelect = this.planetList;
  //     console.log("this.planetListWithSelect", this.planetListWithSelect);     
  //   }
  // }
  ngOnInit(): void {
    this.initialPlanetList = [...this.planetList];
  }

  public planetSelected(planetName: string) {

    console.log(planetName);

    let planet : IPlanet = this.initialPlanetList.find( p => p.name === planetName);
        
    this.destinationDistance = planet.distance;

    this.onPlanetSelected.emit(new PlanetChange(this.widgetId, this.lastSelectedPlanet, planet));

    this.lastSelectedPlanet = planet;
  }

  public vehicleSelected(vehicleChange : VehicleChange) {
    console.log(JSON.stringify(vehicleChange));
    this.onVehicleSelected.emit(vehicleChange);
  }


}
