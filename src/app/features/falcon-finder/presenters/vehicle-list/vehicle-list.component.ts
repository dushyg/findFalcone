import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IVehicle } from 'src/app/core/models/vehicle';


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  constructor() { }

  @Input() public vehicleList : IVehicle[];
  @Input() public destinationDistance : number;
  @Input() public widgetId : string;

  @Output() public onVehicleSelected = new EventEmitter<IVehicle>();
  
  public selectedVehicle : IVehicle ;
  
  ngOnInit() {
  }

  public vehicleSelected(vehicle : IVehicle) {
    console.log('vehicle select - ', vehicle);
    this.selectedVehicle = vehicle;
    this.onVehicleSelected.emit(vehicle);
  }

}
