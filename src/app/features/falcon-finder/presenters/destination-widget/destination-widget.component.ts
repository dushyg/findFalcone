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
export class DestinationWidgetComponent implements OnInit { //, OnChanges
  

  constructor() { 
    
    this.widgetId = ""+DestinationWidgetComponent.createdWidgetCount++;
    this.selectedPlanet = <IPlanet>{
      name : 'Select',
      distance : 0
    };

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
  public dummyPlanet : IPlanet ;
  //private planetsPopulated = false;
  ngOnInit() {
    
    // console.log("planetlist", this.planetList);
    // this.planetListWithSelect = [].concat([this.dummyPlanet], this.planetList);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const planetListChange : SimpleChange = changes['planetList'];
    // bind only one time so that planets available to select the first time are also available irrespective of other planet drop downs making any selections
    if(planetListChange && planetListChange.currentValue.length > 0){
      this.planetListWithSelect = this.planetList.filter( p => !p.includedInSearch || p.name === this.selectedPlanet.name);
      console.log("this.planetListWithSelect", this.planetListWithSelect);
      //this.planetsPopulated = true;
    }
  }

  public planetSelected(planetName: string) {
    console.log(planetName);
    let planet : IPlanet = this.planetListWithSelect.find( p => p.name === planetName);
    
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
      widgetId : this.widgetId,
      selectedVehicle : vehicle
    });
  }

}
