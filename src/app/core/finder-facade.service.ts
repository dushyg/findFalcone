import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { IPlanet } from './models/planet';
import { Observable, BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { IVehicle } from './models/vehicle';
import { IFindFalconResponse } from './models/find-falcon-response';
import { IFindFalconRequest } from './models/find-falcon-request';
import { FalconFinderService } from './falcon-finder.service';
import { ISearchAttempt } from './models/searchAttempt';
import { IFalconAppState } from './models/falconApp.state';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IVehicleSelectionParam } from './models/vehicleSelectionParam';
import { FalconeAppStateService } from './falconeAppState.service';

@Injectable({
  providedIn: 'root'
})
export class FinderFacadeService {

  constructor(private planetService : PlanetsService,
              private vehicleService : VehiclesService,
              private finderService : FalconFinderService,
              private appStateService : FalconeAppStateService) { }


  private finderApiToken : string;            

  
  public store$ = this.appStateService.getStore();  

  public maxSearchAttemptAllowed$ = this.store$.pipe( map(state => state.maxSearchAttemptAllowed), distinctUntilChanged());    
  
  public error$ = this.store$.pipe(map(state => state.errorMsg));

  public planetList$ = this.store$.pipe(map(state => state.planetList), distinctUntilChanged());

  public unselectedPlanetList$ = this.store$.pipe(map(state => this.unselectedPlanetsSelector(state)), distinctUntilChanged())

  public vehicleList$ = this.store$.pipe(map(state => state.vehicleList), distinctUntilChanged());  

  public searchAttemptMap$ = this.store$.pipe(map(state => state.searchMap), distinctUntilChanged());

  public totalTimeTaken$ = this.store$.pipe(map(state => state.totalTimeTaken), distinctUntilChanged());

  public planetFoundOn$ = this.store$.pipe(map(state => state.planetFoundOn), distinctUntilChanged());

  public readyToSearch$ = this.store$.pipe(map( state => state.isReadyToSearch), distinctUntilChanged());
  
  public setAppState(state : IFalconAppState) {
    
    this.appStateService.setAppState(state);    
  }  
  
  private unselectedPlanetsSelector = function getUnselectedPlanets(state : IFalconAppState) : IPlanet[]{

    return state.planetList.filter(
      p => !p.includedInSearch
    );
  }

  
  // public methods

  public initializeAppData() {

    forkJoin(
      this.vehicleService.getAllVehicles(),
      this.planetService.getAllPlanets(),
      this.finderService.getFalconFinderApiToken()
    )
    .subscribe( response => {
      
        this.finderApiToken = response[2].token;
        const vehicleList : IVehicle[] = response[0];
        const planetList : IPlanet[] = response[1];
        // todo handle error scenarios
        this.setAppState({...this.appStateService.getAppState(),
            planetList,
            vehicleList
        });          
    },
      (error) => {
        this.appStateService.updateError(error);
      }
    );
  }

  
  public updatePlanetList(planetList : IPlanet[]) : void {
    
    this.setAppState({ ...this.appStateService.getAppState(), planetList})
  } 

  public markPlanetForSearch(planet : IPlanet) {    
    
    const updatedPlanetList : IPlanet[] = this.appStateService.getPlanetList().map(
      p => {
        const planetCopy = {...p};
        
        if(p.name === planet.name) {
          planetCopy.includedInSearch = true;
        }

        return planetCopy;
      }
    ); 
    
    this.updatePlanetList(updatedPlanetList);

  }  
  
  public updateVehicleAvailability(vehicleSelectionParam : IVehicleSelectionParam) : void {
            
      const existingSearchAttempt = this.appStateService.getSearchMap().get(vehicleSelectionParam.widgetId);
      
      let existingVehicle = null;

      if(existingSearchAttempt) {
        existingVehicle = existingSearchAttempt.vehicleUsed;         
      }
      
      const updatedVehicleList = this.appStateService.getVehicleList().map(
        vehicle => {
          const vehicleCopy = {...vehicle};
          if(existingVehicle && existingVehicle.name === vehicleCopy.name) {
            //free any existing vehicle was earlier in use for the same destination widget
            ++vehicleCopy.availNumUnits;
          }
          else if(vehicleCopy.name === vehicleSelectionParam.selectedVehicle.name){
            // reduce available count of this vehicle by 1
            --vehicleCopy.availNumUnits;
          }
          return vehicleCopy;
        }
    );                      
    this.updateVehicleList(updatedVehicleList);
  }

  public updateVehicleList(vehicleList : IVehicle[]) : void {

    this.setAppState({ ...this.appStateService.getAppState(), vehicleList});    
  }  

  public updateSearchData(widgetId : string, searchAttempt : ISearchAttempt) : void {
    
    if(!searchAttempt)
    {
      return;
    }

    // step 1 : update the search attempt map to reflect latest UI selections
    const searchMap =  new Map<string, ISearchAttempt>(this.appStateService.getSearchMap());    
    
    const existingSearchAttempt = searchMap.get(widgetId);

    // initialize searchAttemptToBeUpdated with existing data if any
    const searchAttemptToBeUpdated = <ISearchAttempt>{ ...existingSearchAttempt };
  
    if(searchAttempt.searchedPlanet) {
      searchAttemptToBeUpdated.searchedPlanet = this.appStateService.getPlanetByName(searchAttempt.searchedPlanet.name);
    }

    if(searchAttempt.vehicleUsed) {
      searchAttemptToBeUpdated.vehicleUsed = this.appStateService.getVehicleByName(searchAttempt.vehicleUsed.name);  
    }
    
    searchMap.set(widgetId,  searchAttemptToBeUpdated);
            
    // step 2 : Identify if we have required search criteria to be able to call findFalcone api method
    const readyState = this.appStateService.getReadyWidgetState(searchMap);
    
    let isReadyToSearch = false;
    
    const maxSearchAttemptAllowed = this.appStateService.getMaxSearchAttemptAllowed(); 
    if(searchMap.size === maxSearchAttemptAllowed){
      
      let countReadyWidgets = readyState.readyWidgetCount;

      if(countReadyWidgets === maxSearchAttemptAllowed)
      {
        isReadyToSearch = true;
      }
      
    }
    
    // update total time taken in the state
    const totalTimeTaken = readyState.totalTimeTaken;

    this.setAppState({...this.appStateService.getAppState(), searchMap, isReadyToSearch, totalTimeTaken});
  }  

  public updateTotalTimeTaken(totalTimeTaken : number) {

    this.setAppState({ ...this.appStateService.getAppState(), totalTimeTaken});    
  }          

  public findFalcon(request : IFindFalconRequest) {

     request.token = this.finderApiToken; 
     this.finderService.findFalcon(request)
        .subscribe( (response: IFindFalconResponse) => {
          let errorMsg = null;  
          if(response) {

            if(response.error) {
              errorMsg = response.error;
              this.appStateService.updateError(errorMsg);
            }
            else if(response.status) {

              if(response.status.trim().toLowerCase() === "success") {

                if(response.planetName) {
                  this.appStateService.updatePlanetFoundOn(response.planetName);
                }
                else {
                  errorMsg = "Search api returned empty planet name";
                  this.appStateService.updateError(errorMsg);
                }
              }
              else if(response.status.trim().toLocaleLowerCase() === "false") {
                errorMsg = "Failure! You were unable to find Falcone. Better luck next time.";
                this.appStateService.updateError(errorMsg);
              }
              else {
                errorMsg = "Search api did not return a response status value."
                this.appStateService.updateError(errorMsg);
              }
            }
          }
          else {
            errorMsg = "Search api returned invalid response."
            this.appStateService.updateError(errorMsg);
          }
        },
        (error) => {
          this.appStateService.updateError(error);
        }
        );
  }  

}
