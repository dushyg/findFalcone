import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IVehicle } from 'src/app/core/models/vehicle';
import VehicleChange from 'src/app/core/models/vehicleChange';
import { Observable } from 'rxjs';
import PlanetUpdates from 'src/app/core/models/planetUpdates';
import VehicleUpdates from 'src/app/core/models/vehicleUpdates';


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {  
  
  constructor() { }

  @Input() public vehicleList : IVehicle[];
  public localVehicleList : IVehicle[];
  @Input() public destinationDistance : number;
  @Input() public widgetId : number;
  @Input() public planetListChanges$ : Observable<PlanetUpdates>; 
  @Input() public vehicleListChanges$ : Observable<VehicleUpdates>;

  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  public lastSelectedVehicle : IVehicle = null;
  
  ngOnInit() {
    this.localVehicleList = [...this.vehicleList];

    this.vehicleListChanges$.subscribe( vehicleChanges => {

      // If vehicle was changed in an earlier widget then reset the vehicle list 
      if(vehicleChanges && vehicleChanges.vehicleChange && vehicleChanges.vehicles) {

        this.localVehicleList = [...vehicleChanges.vehicles];
      }

    });

    this.planetListChanges$.subscribe( planetChanges => {

      if(planetChanges && planetChanges.planetChange && planetChanges.planets) {

        //If planet was changed in an earlier widget then reset the initialPlanetList to currently remaining planets list
        if(planetChanges.planetChange.widgetId < this.widgetId) {

          
        }
      }
  });    
  }

  // ngOnChanges(simpleChanges : SimpleChanges): void {
  //   const vehicleListChange = simpleChanges['vehicleList'];
  //   if(vehicleListChange) {

  //     const vehicleList : IVehicle[] = vehicleListChange.currentValue;

  //     //if(!this.localVehicleList && vehicleList && vehicleList.length > 0) {
  //     if(vehicleList && vehicleList.length > 0) {
  //       this.localVehicleList = vehicleList;
  //     }    
  //   }
     
  // }

  public vehicleSelected(vehicle : IVehicle) {
    console.log('vehicle select - ', vehicle);
    
    this.onVehicleSelected.emit(new VehicleChange(this.widgetId, this.lastSelectedVehicle, vehicle));

    this.lastSelectedVehicle = vehicle;
  }


}
