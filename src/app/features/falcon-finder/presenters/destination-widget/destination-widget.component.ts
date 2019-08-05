import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { IPlanet } from 'src/app/core/models/planet';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';

@Component({
  selector: 'app-destination-widget',
  templateUrl: './destination-widget.component.html',
  styleUrls: ['./destination-widget.component.css']
})
export class DestinationWidgetComponent implements OnInit, OnChanges {
  

  constructor() { 
    
    this.widgetId = `widget_${DestinationWidgetComponent.createdWidgetCount++}`;
    console.log(this.widgetId);
  }

  @Input() public vehicleList : IVehicle[];
  @Input() public planetList : IPlanet[];
  public planetListWithSelect : IPlanet[];

  @Output() public onPlanetSelected  = new EventEmitter<IPlanetSelectionParam>();
  @Output() public onVehicleSelected = new EventEmitter<IVehicleSelectionParam>();
  
  private static createdWidgetCount : number = 0;
  public destinationDistance : number = 0 ;  
  public widgetId : string; 
  public selectedPlanet : IPlanet;
  public dummyPlanet : IPlanet = <IPlanet>{
    name : 'Select',
    distance : 0
  };
  
  ngOnInit() {
    this.selectedPlanet = this.dummyPlanet;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const planetListChange : SimpleChange = changes['planetList'];
    if(planetListChange && planetListChange.currentValue.length > 0){
      this.planetListWithSelect = [].concat([this.dummyPlanet], this.planetList);
    }
  }

  public planetSelected(planet : IPlanet) {
    console.log(planet);
    this.selectedPlanet = planet;
    this.destinationDistance = planet.distance;
    this.onPlanetSelected.emit(<IPlanetSelectionParam>{
      widgetId : this.widgetId,
      selectedPlanet : planet
    });
  }

  public vehicleSelected(vehicle : IVehicle) {
    console.log(JSON.stringify(vehicle));
    this.onVehicleSelected.emit(<IVehicleSelectionParam>{
      componentId : this.widgetId,
      selectedVehicle : vehicle
    });
  }

}
