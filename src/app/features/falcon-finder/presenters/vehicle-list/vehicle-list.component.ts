import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IVehicle } from 'src/app/core/models/vehicle';
import VehicleChange from 'src/app/core/models/vehicleChange';


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

  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  public lastSelectedVehicle : IVehicle = null;
  
  ngOnInit() {
    this.localVehicleList = [...this.vehicleList];
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

  private reduceAvailCount

}
