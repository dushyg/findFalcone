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

@Component({
  selector: 'app-finder-board',
  templateUrl: './finder-board.component.html',
  styleUrls: ['./finder-board.component.css']
})
export class FinderBoardComponent implements OnInit, OnDestroy {
    
  constructor(private finderFacadeService : FalconeFacade,
              private router : Router) {
    console.log('finder facade service constructed',finderFacadeService);
   }
     
  public error$ : Observable<string>;
  // public planetList$ : Observable<IPlanet[]>;
  // public vehicleList$ : Observable<IVehicle[]>;
  public planetList : IPlanet[];
  public vehicleList : IVehicle[];
  public timeTaken$ : Observable<number>;  
  public readyToSearch$: Observable<boolean>;
  public countPlanetsToBeSearched : number;
  private findFalconRequest : IFindFalconRequest ; 
  private isComponentActive =  true;

  ngOnInit() {
    
   
    this.error$ = this.finderFacadeService.errorMessage$;
    // this.planetList$ = this.finderFacadeService.planetList$;
    // this.vehicleList$ = this.finderFacadeService.vehicleList$;
    this.timeTaken$ = this.finderFacadeService.totalTimeTaken$;    
    this.readyToSearch$ = this.finderFacadeService.isReadyForSearch$;
    

    this.finderFacadeService.planetListChanges$
        .pipe( takeWhile( () => this.isComponentActive))
        .subscribe( planetChange => {
            this.planetList = planetChange.planets; 
        });     
    this.finderFacadeService.maxSearchAttemptAllowed$
          .pipe( takeWhile( () => this.isComponentActive))
          .subscribe( count => {
              this.countPlanetsToBeSearched = count;  
          });     

    combineLatest(this.finderFacadeService.searchAttemptMap$, this.finderFacadeService.readyToSearch$)
          .subscribe( searchState => {
              const searchAttemptMap = searchState[0];
              const isReadyToSearch = searchState[1];

              if(isReadyToSearch && searchAttemptMap) {
                  
                const request = <IFindFalconRequest> {
                    planet_names : new Array<string>(this.countPlanetsToBeSearched),
                    vehicle_names : new Array<string>(this.countPlanetsToBeSearched)
                  };

                for(let searchAttemptEntry of searchAttemptMap) {

                  const widgetId = searchAttemptEntry[0];
                  const searchAttempt = searchAttemptEntry[1];

                  request.planet_names[+widgetId] = searchAttempt.searchedPlanet.name;
                  request.vehicle_names[+widgetId] = searchAttempt.vehicleUsed.name;
                }  

                this.findFalconRequest = request;
              }
              else {
                this.findFalconRequest = null;
              }
          }); 
    
    this.finderFacadeService.initializeAppData();
  }

  planetSelected(planetSelectionParam : IPlanetSelectionParam) {
    console.log('finder board - planet selected', planetSelectionParam);
    
    this.finderFacadeService.markPlanetForSearch(planetSelectionParam.selectedPlanet);
    this.finderFacadeService.updateSearchData(planetSelectionParam.widgetId, <ISearchAttempt>{searchedPlanet : planetSelectionParam.selectedPlanet})

  }

  vehicleSelected(vehicleSelectionParam : IVehicleSelectionParam){
    console.log('finder board - vehicle selected', vehicleSelectionParam);

    this.finderFacadeService.updateVehicleAvailability(vehicleSelectionParam);
    this.finderFacadeService.updateSearchData(vehicleSelectionParam.widgetId, <ISearchAttempt>{vehicleUsed : vehicleSelectionParam.selectedVehicle});
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
