import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';

import { IPlanet } from 'src/app/core/models/planet';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';
import PlanetChange from 'src/app/core/models/planetChange';
import VehicleChange from 'src/app/core/models/vehicleChange';
import { Observable, Subject } from 'rxjs';
import PlanetUpdates from 'src/app/core/models/planetUpdates';
import VehicleUpdates from 'src/app/core/models/vehicleUpdates';
import { ISearchAttempt } from 'src/app/core/models/searchAttempt';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-destination-widget',
  templateUrl: './destination-widget.component.html'
})
export class DestinationWidgetComponent implements OnInit, OnDestroy {
      
  public vehicleList : IVehicle[];
  public planetList : IPlanet[];
  // @Input() public searchAttemptMap : Map<string, ISearchAttempt> ;  

  // @Output() public onPlanetSelected  = new EventEmitter<PlanetChange>();
  // @Output() public onVehicleSelected = new EventEmitter<VehicleChange>();  
  
  private static createdWidgetCount : number = 0;
  public destinationDistance : number = 0 ;  
  public widgetId : number; 
  public lastSelectedPlanet : string = "Select";
  
  private resetTypeAheadSubject = new Subject<void>();
  public resetTypeAhead$ : Observable<void> = this.resetTypeAheadSubject.asObservable();
  private isComponentActive = true;

  constructor(private finderFacadeService : FinderFacadeService) { 
    
    // using modulo operator to cycle the widget ids from 1 to max widget count
    this.widgetId = DestinationWidgetComponent.createdWidgetCount % this.finderFacadeService.getCountOfWidgetsDisplayed() + 1;
    DestinationWidgetComponent.createdWidgetCount++;
    
  }

  ngOnInit(): void {

     this.finderFacadeService.availablePlanetListUpdated$
      .pipe(takeWhile( () => this.isComponentActive))     
      .subscribe( (widgetIdToPlanetListMap) => {
        if(!widgetIdToPlanetListMap)
        {
          return;
        }

        const updatedPlanetList : IPlanet[] = widgetIdToPlanetListMap.get(this.widgetId.toString());
        if(updatedPlanetList !== this.planetList) {
          this.planetList = updatedPlanetList;
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

    // this.finderFacadeService.planetVm$
    //   .pipe(takeWhile( () => this.isComponentActive))     
    //   .subscribe( ({widgetIdToPlanetListMap, lastUpdatedWidgetId}) => {

    //     const updatedPlanetList : IPlanet[] = widgetIdToPlanetListMap.get(this.widgetId.toString());
    //     if(updatedPlanetList !== this.planetList) {
    //       this.planetList = updatedPlanetList;
    //     }

    //     if(this.widgetId > lastUpdatedWidgetId) {
    //       this.clearLastSelection();
    //     }
    //   });  
    
  }
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('ngOnchanges DestinationWidgetComponent, widgetId', changes, this.widgetId);
  //   const searchAttemptMapChange : SimpleChange = changes['searchAttemptMap'];    
  //   if(!searchAttemptMapChange){
  //     return;
  //   }

  //   let updatedSearchMap : Map<string, ISearchAttempt> = searchAttemptMapChange.currentValue;
  //   if(!updatedSearchMap){
  //     return;
  //   }
    
  //   const latestSearchAttempt : ISearchAttempt = updatedSearchMap.get(this.widgetId.toString());

  //   const updatedPlanets : IPlanet[] = latestSearchAttempt.planetsShown;
  //   const updatedVehicles : IVehicle[] = latestSearchAttempt.vehiclesShown;

  //   if(updatedPlanets) {
  //     this.planetList = updatedPlanets;  
  //   }

  //   if(updatedVehicles){
  //     this.vehicleList = updatedVehicles;
  //   }    
  // }

  // updatePlanetList( widgetUpdate : {widgetId : number, changer : string}  ) {
        
  //   //If planet was changed in an earlier widget then reset the initialPlanetList to currently remaining planets list
  //   if( (widgetUpdate.changer === 'planetUpdate' || widgetUpdate.changer === 'vehicleUpdate') && widgetUpdate.widgetId < this.widgetId) {

  //     this.setLatestPlanetList();      
  //     this.clearLastSelection();
  //   }    
  
  // }

  clearLastSelection(): void {
    this.lastSelectedPlanet = 'Select';
    this.resetTypeAheadSubject.next();
  }
 
  public planetSelected(selectedPlanet: IPlanet) {    
       
    this.destinationDistance = selectedPlanet.distance;

    this.lastSelectedPlanet = selectedPlanet.name;

    this.finderFacadeService.planetChanged(new PlanetChange(this.widgetId, null, selectedPlanet));
   
  }

  // public vehicleSelected(vehicleChange : VehicleChange) {
  //   // console.log(JSON.stringify(vehicleChange));
    
  //   this.finderFacadeService.vehicleChanged(vehicleChange);
  // }

  // setLatestPlanetList() : void {
  //   this.initialPlanetList = [...this.planetList];
  // }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
  

}
