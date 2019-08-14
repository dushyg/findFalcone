import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IVehicle } from 'src/app/core/models/vehicle';


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnChanges {  
  
  constructor() { }

  @Input() public vehicleList : IVehicle[];
  public localVehicleList : IVehicle[];
  @Input() public destinationDistance : number;
  @Input() public widgetId : string;

  @Output() public onVehicleSelected = new EventEmitter<IVehicle>();
  
  public selectedVehicle : IVehicle = { name: "", maxDistance: 0, totalNumUnits : 0, speed : 0, availNumUnits: 0} ;
  
  ngOnInit() {
  }

  ngOnChanges(simpleChanges : SimpleChanges): void {
    const vehicleListChange = simpleChanges['vehicleList'];
    if(vehicleListChange) {

      const vehicleList : IVehicle[] = vehicleListChange.currentValue;

      //if(!this.localVehicleList && vehicleList && vehicleList.length > 0) {
      if(vehicleList && vehicleList.length > 0) {
        this.localVehicleList = vehicleList;
      }    
    }
     
  }

  public vehicleSelected(vehicle : IVehicle) {
    console.log('vehicle select - ', vehicle);
    this.selectedVehicle = vehicle;
    this.onVehicleSelected.emit(vehicle);
  }

  private reduceAvailCount

}
