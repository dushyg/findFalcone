import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Observable, combineLatest } from 'rxjs';
import { IPlanet } from 'src/app/core/models/planet';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';
import { IFindFalconRequest } from 'src/app/core/models/find-falcon-request';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { Router } from '@angular/router';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { ISearchAttempt } from 'src/app/core/models/searchAttempt';
import FalconeFacade  from 'src/app/core/facade.service';
import PlanetChange from 'src/app/core/models/planetChange';
import VehicleChange from 'src/app/core/models/vehicleChange';
import PlanetUpdates from 'src/app/core/models/planetUpdates';
import VehicleUpdates from 'src/app/core/models/vehicleUpdates';

@Component({
  selector: 'app-finder-board',
  templateUrl: './finder-board.component.html',
  styleUrls: ['./finder-board.component.css']
})
export class FinderBoardComponent implements OnInit, OnDestroy {
    
  constructor(private finderFacadeService : FalconeFacade,
              private router : Router) {
    
   }
     
  public error$ : Observable<string>;
  // public planetList$ : Observable<IPlanet[]>;
  // public vehicleList$ : Observable<IVehicle[]>;
  public planetList : IPlanet[];
  public vehicleList : IVehicle[];
  public timeTaken : number;  
  public isReadyToSearch: boolean;
  public countPlanetsToBeSearched : number;
  private findFalconRequest : IFindFalconRequest ; 
  private isComponentActive =  true;  
  // public planetListChanges$ : Observable<PlanetUpdates> = this.finderFacadeService.planetListChanges$; 
  // public vehicleListChanges$ : Observable<VehicleUpdates> = this.finderFacadeService.vehicleListChanges$;
  
  public planetsUpdated : {widgetId : number, changer : string} ; 
  public vehiclesUpdated : {widgetId : number, changer : string} ; 
    
  ngOnInit() {
    
   
    this.error$ = this.finderFacadeService.errorMessage$;
    // this.planetList$ = this.finderFacadeService.planetList$;
    // this.vehicleList$ = this.finderFacadeService.vehicleList$;
    this.finderFacadeService.totalTimeTaken$.subscribe( totalTimeTaken => {
      this.timeTaken = totalTimeTaken;
    });    

    this.finderFacadeService.isReadyForSearch$.subscribe( isReadyForSearch => {
      this.isReadyToSearch = isReadyForSearch;
    });

    this.finderFacadeService.planets$.subscribe( planets => {

      this.planetList = planets;
    });

    this.finderFacadeService.vehicles$.subscribe( vehicles => {

      this.vehicleList = vehicles;
    });

    this.finderFacadeService.planetsUpdated$.subscribe( update => {      
      this.planetsUpdated = update;
    }); 

    this.finderFacadeService.vehiclesUpdated$.subscribe( update => {
      this.vehiclesUpdated = update;
    }); 

    // this.finderFacadeService.planetListChanges$
    //     .pipe( takeWhile( () => this.isComponentActive))
    //     .subscribe( planetChange => {
    //         this.planetList = planetChange.planets; 
    //     });     

    this.finderFacadeService.maxSearchAttemptAllowed$
          .pipe( takeWhile( () => this.isComponentActive))
          .subscribe( count => {
              this.countPlanetsToBeSearched = count;  
          });     

    combineLatest(this.finderFacadeService.searchMap$, this.finderFacadeService.isReadyForSearch$)
          .subscribe( searchState => {
              const searchAttemptMap = searchState[0];
              const isReadyToSearch = searchState[1];

              if(isReadyToSearch && searchAttemptMap) {
                  
                const request = <IFindFalconRequest> {
                    planet_names : new Array<string>(this.countPlanetsToBeSearched),
                    vehicle_names : new Array<string>(this.countPlanetsToBeSearched)
                  };
                
                let index = 0;
                for(let searchAttemptEntry of searchAttemptMap) {
                  
                  const searchAttempt = searchAttemptEntry[1];

                  request.planet_names[index] = searchAttempt.searchedPlanet.name;
                  request.vehicle_names[index] = searchAttempt.vehicleUsed.name;
                  
                  index++;
                }  

                this.findFalconRequest = request;
              }
              else {
                this.findFalconRequest = null;
              }
          }); 
    
    this.finderFacadeService.initializeAppData();
  }

  planetSelected(planetSelectionParam : PlanetChange) {
    // console.log('finder board - planet selected', planetSelectionParam);
    
    this.finderFacadeService.planetChanged(planetSelectionParam);

  }

  vehicleSelected(vehicleSelectionParam : VehicleChange){
    // console.log('finder board - vehicle selected', vehicleSelectionParam);

    this.finderFacadeService.vehicleChanged(vehicleSelectionParam);
  }


  public findFalcone(){

    // todo check if a valid request can be constructed
    // if it cant be done show error
    // else fire off a request to find falcone and navigate to result page
      // const request : IFindFalconRequest = <IFindFalconRequest>{
      //   planet_names : ['Donlon','Enchai','Pingasor','Sapir'],
      //   vehicle_names : ['Space pod','Space pod','Space ship','Space shuttle']        
      // };
      
      this.finderFacadeService.findFalcon(this.findFalconRequest);
      this.router.navigate(['finderboard', 'result']);
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
  
}
