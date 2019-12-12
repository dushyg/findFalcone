import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';
import { IVehicle } from 'src/app/core/models/vehicle';
import VehicleChange from 'src/app/core/models/vehicleChange';
import { Observable } from 'rxjs';
import PlanetUpdates from 'src/app/core/models/planetUpdates';
import VehicleUpdates from 'src/app/core/models/vehicleUpdates';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  
  private isComponentActive: boolean = true;
  
  constructor(private finderFacadeService : FinderFacadeService) { }

  public vehicleList : IVehicle[];
  // public localVehicleList : IVehicle[];
  @Input() public destinationDistance : number;
  @Input() public widgetId : number;
  // @Input() public planetListChanges$ : Observable<PlanetUpdates>; 
  // @Input() public vehicleListChanges$ : Observable<VehicleUpdates>;

  // @Input() public planetListChanged : {widgetId : number, changer : string} ; 
  // @Input() public vehicleListChanged : {widgetId : number, changer : string} ;

  // @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();
  
  public lastSelectedVehicle : IVehicle = <IVehicle>{ availNumUnits : 0, name : null};
  
  ngOnInit() {

    this.finderFacadeService.availableVehicleListUpdated$
    .pipe(takeWhile( () => this.isComponentActive))
    .subscribe( (widgetIdToVehicleListMap) => {
        if(!widgetIdToVehicleListMap){
          return;
        }
        const updatedVehicleList : IVehicle[] = widgetIdToVehicleListMap.get(this.widgetId.toString());
        if(updatedVehicleList !== this.vehicleList){ 
          this.vehicleList = updatedVehicleList;
        }
    });

    this.finderFacadeService.lastUpdatedWidgetId$
      .pipe(takeWhile( () => this.isComponentActive))     
      .subscribe( (lastUpdatedWidgetId) => {
        if(lastUpdatedWidgetId === null || lastUpdatedWidgetId === undefined){
          return;
        }
        if(this.widgetId > lastUpdatedWidgetId) {
          this.clearLastSelection();
        }
        
      });
    //this.localVehicleList = [...this.vehicleList];   
    // this.finderFacadeService.vehicleVm$
    //   .pipe(takeWhile( () => this.isCompnentActive))
    //   .subscribe( ({widgetIdToVehicleListMap, lastUpdatedWidgetId}) => {
        
    //     const updatedVehicleList : IVehicle[] = widgetIdToVehicleListMap.get(this.widgetId.toString());
    //     if(updatedVehicleList !== this.vehicleList){ 
    //       this.vehicleList = updatedVehicleList;
    //     }
    //     if(this.widgetId > lastUpdatedWidgetId){
    //       // since there were no updates to the vehicle list, it means some other widget's planet or vehicle changed
    //       this.clearLastSelection();
    //     }
    //   }); 
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('ngOnchanges VehicleListComponent, widgetId', changes, this.widgetId);
  //   const planetListChange : SimpleChange = changes['planetListChanged'];    
  //   if(planetListChange){        
  //     let widgetUpdate = planetListChange.currentValue;
  //     if(widgetUpdate) {
  //       this.updateVehicleList(widgetUpdate);
  //     }
  //   }

  //   const vehicleListChange : SimpleChange = changes['vehicleListChanged'];    
  //   if(vehicleListChange){
  //     let widgetUpdate = vehicleListChange.currentValue;
  //     if(widgetUpdate) {
  //       this.updateVehicleList(widgetUpdate);
  //     }
  //   }
  // }

  public vehicleSelected(vehicle : IVehicle) {
    // console.log('vehicle select - ', vehicle);
    
    this.finderFacadeService.vehicleChanged(new VehicleChange(this.widgetId, {...this.lastSelectedVehicle}, {...vehicle}))
    //this.onVehicleSelected.emit();

    this.lastSelectedVehicle = vehicle;

    // // reduce the availNumUnits of local vehicle instance if its not the default vehicle whose name is null
    // if(this.lastSelectedVehicle.name) {
    //   this.lastSelectedVehicle.availNumUnits--;
    // }
  }

  // private setVehicleListWithLatestVehicles() : void {
  //   this.localVehicleList = [...this.vehicleList]; 
  // }

  // updateVehicleList( widgetUpdate : {widgetId : number, changer : string}  ) {
        
  //   //If planet was changed in an earlier widget then reset the initialPlanetList to currently remaining planets list
  //   if(widgetUpdate.changer === 'planetUpdate' && widgetUpdate.widgetId <= this.widgetId) {

  //     this.setVehicleListWithLatestVehicles();
  //     this.clearLastSelection();
  //   }
  
  //   if(widgetUpdate.changer === 'vehicleUpdate' && widgetUpdate.widgetId < this.widgetId) {
  //     this.setVehicleListWithLatestVehicles();
  //     this.clearLastSelection();
  //   }
  // }

  clearLastSelection(): void {
    this.lastSelectedVehicle = <IVehicle>{ availNumUnits : 0, name : null};
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }  
  
}
