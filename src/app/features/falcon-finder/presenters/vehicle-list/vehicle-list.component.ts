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
  // @Input() public planetListChanges$ : Observable<PlanetUpdates>; 
  // @Input() public vehicleListChanges$ : Observable<VehicleUpdates>;

  @Input() public planetListChanges$ : Observable<number>; 
  @Input() public vehicleListChanges$ : Observable<number>;

  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  public lastSelectedVehicle : IVehicle = <IVehicle>{ availNumUnits : 0, name : null};
  
  ngOnInit() {
    this.localVehicleList = [...this.vehicleList];

    this.vehicleListChanges$.subscribe( widgetId => {

      // If vehicle was changed in an earlier widget then reset the vehicle list 
      if(widgetId < this.widgetId) {

        this.setVehicleListWithLatestVehicles();
      }

    });

    this.planetListChanges$.subscribe( widgetId => {
      
        // If planet was changed then reset the list of available vehicles for all the widgets
        this.setVehicleListWithLatestVehicles()                
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
    
    this.onVehicleSelected.emit(new VehicleChange(this.widgetId, {...this.lastSelectedVehicle}, {...vehicle}));

    this.lastSelectedVehicle = vehicle;

    // reduce the availNumUnits of local vehicle instance if its not the default vehicle whose name is null
    if(this.lastSelectedVehicle.name) {
      this.lastSelectedVehicle.availNumUnits--;
    }
  }

  private setVehicleListWithLatestVehicles() : void {
    this.localVehicleList = [...this.vehicleList]; 
  }

}
