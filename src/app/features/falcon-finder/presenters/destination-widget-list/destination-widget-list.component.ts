import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IPlanet } from 'src/app/core/models/planet';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';
import { Observable } from 'rxjs';
import PlanetUpdates from 'src/app/core/models/planetUpdates';
import VehicleUpdates from 'src/app/core/models/vehicleUpdates';

@Component({
  selector: 'app-destination-widget-list',
  templateUrl: './destination-widget-list.component.html',
  styleUrls: ['./destination-widget-list.component.css']
})
export class DestinationWidgetListComponent implements OnInit {

  constructor() { }

  @Input() vehicleList : IVehicle[];
  @Input() planetList : IPlanet[];
  @Input() countPlanetsToBeSearched : number; 
  // @Input() public planetListChanges$ : Observable<PlanetUpdates>; 
  // @Input() public vehicleListChanges$ : Observable<VehicleUpdates>;
  @Input() public planetListChanged : {widgetId : number, changer : string} ; 
  @Input() public vehicleListChanged : {widgetId : number, changer : string} ;


  @Output() public onPlanetSelected  = new EventEmitter<IPlanetSelectionParam>();
  @Output() public onVehicleSelected = new EventEmitter<IVehicleSelectionParam>();
  
  public widgetCountIterator : number[];
  
  ngOnInit() {
    this.widgetCountIterator = new Array<number>(this.countPlanetsToBeSearched).fill(0);
  }

  planetSelected(planetSelectionParam : IPlanetSelectionParam) {
    // console.log('destination widget', planetSelectionParam);
    this.onPlanetSelected.emit(planetSelectionParam);
  }

  vehicleSelected(vehicleSelectionParam : IVehicleSelectionParam){
    this.onVehicleSelected.emit(vehicleSelectionParam);
  }
}
