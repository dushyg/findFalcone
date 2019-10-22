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
export class DestinationWidgetComponent implements OnInit {
    
  @Input() public vehicleList : IVehicle[];
  @Input() public planetList : IPlanet[];
  @Input() public planetListChanges$ : Observable<PlanetUpdates>; 
  @Input() public vehicleListChanges$ : Observable<VehicleUpdates>;
  private initialPlanetList : IPlanet[];

  @Output() public onPlanetSelected  = new EventEmitter<PlanetChange>();
  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  private static createdWidgetCount : number = 0;
  public destinationDistance : number = 0 ;  
  public widgetId : number; 
  public lastSelectedPlanet : IPlanet ;
  public defaultSelectedPlanet : IPlanet ;

  constructor() { 
    
    this.widgetId = DestinationWidgetComponent.createdWidgetCount++;

    this.lastSelectedPlanet = this.defaultSelectedPlanet = <IPlanet>{
      name : 'Select',
      distance : 0
    };

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
    console.log('destination-widget oninit -> this.planetList', this.planetList);

    if(this.planetList) {
      this.initialPlanetList = [...this.planetList, this.defaultSelectedPlanet];
    }
    

    this.planetListChanges$.subscribe( planetChanges => {

        if(planetChanges && planetChanges.planetChange && planetChanges.planets) {

          //If planet was changed in an earlier widget then reset the initialPlanetList to currently remaining planets list
          if(planetChanges.planetChange.widgetId < this.widgetId) {

            this.initialPlanetList = [...planetChanges.planets, this.defaultSelectedPlanet];
          }
        }
    });    
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
