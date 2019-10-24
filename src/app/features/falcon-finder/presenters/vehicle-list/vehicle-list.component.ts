import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
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

  @Input() public planetListChanged : number; 
  @Input() public vehicleListChanged : number;

  @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  public lastSelectedVehicle : IVehicle = <IVehicle>{ availNumUnits : 0, name : null};
  
  ngOnInit() {
    this.localVehicleList = [...this.vehicleList];    
  }

  ngOnChanges(changes: SimpleChanges): void {
    const planetListChange : SimpleChange = changes['planetListChanged'];    
    if(planetListChange){        
        this.setVehicleListWithLatestVehicles();
    }

    const vehicleListChange : SimpleChange = changes['vehicleListChanged'];    
    if(vehicleListChange){
      let widgetId = vehicleListChange.currentValue;
      this.updateVehicleList(widgetId);
    }
  }

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

  updateVehicleList( widgetId ) {
        
    //If planet was changed in an earlier widget then reset the initialPlanetList to currently remaining planets list
    if(widgetId < this.widgetId) {

      this.setVehicleListWithLatestVehicles();
    }
  
  }

}
