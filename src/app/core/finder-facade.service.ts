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

let _state : IFalconAppState = {
  errorMsg : "",
  isLoading : false,
  maxSearchAttemptAllowed : 4,
  planetList : [],
  searchMap : new Map<string, ISearchAttempt>(),
  totalTimeTaken : 0,
  vehicleList : [],
  planetFoundOn : null,
  isReadyToSearch : false
};            


@Injectable({
  providedIn: 'root'
})
export class FinderFacadeService {

  constructor(private planetService : PlanetsService,
              private vehicleService : VehiclesService,
              private finderService : FalconFinderService) { }


  private finderApiToken : string;            

  private store = new BehaviorSubject<IFalconAppState>(_state);
  public store$ = this.store.asObservable();  

  public maxSearchAttemptAllowed$ = this.store$.pipe( map(state => state.maxSearchAttemptAllowed), distinctUntilChanged());    
  
  public error$ = this.store$.pipe(map(state => state.errorMsg));

  public planetList$ = this.store$.pipe(map(state => state.planetList), distinctUntilChanged());

  public unselectedPlanetList$ = this.store$.pipe(map(state => this.unselectedPlanetsSelector(state)), distinctUntilChanged())

  public vehicleList$ = this.store$.pipe(map(state => state.vehicleList), distinctUntilChanged());  

  public searchAttemptMap$ = this.store$.pipe(map(state => state.searchMap), distinctUntilChanged());

  public totalTimeTaken$ = this.store$.pipe(map(state => state.totalTimeTaken), distinctUntilChanged());

  public planetFoundOn$ = this.store$.pipe(map(state => state.planetFoundOn), distinctUntilChanged());

  public readyToSearch$ = this.store$.pipe(map( state => state.isReadyToSearch), distinctUntilChanged());
  
  // private methods

  private setAppState(state : IFalconAppState) {

    // update the _state variable to reflect latest state
    _state = state;

    // update the store observable with lastest state value
    this.store.next(_state);    
  }
  
  private updatePlanetFoundOn(planetFoundOn : string) : void {
    
    this.setAppState({ ..._state, planetFoundOn});    
  }
  
  private setMaxSearchAttemptAllowed(maxSearchAttemptAllowed : number) : void {

    this.setAppState({..._state, maxSearchAttemptAllowed});
  }
    
  private updateError(error : any) : void { 
    console.log('setError', error);
    const errorMsg = error;
    this.setAppState({ ..._state, errorMsg});
  }      
  
  private getReadyWidgetState(searchAttemptMap : Map<string, ISearchAttempt>) : { readyWidgetCount : number, totalTimeTaken : number} {

    let readyWidgetCount = 0;
    let totalTimeTaken = 0;

      for(let searchAttempt of searchAttemptMap.values()) {

          if(searchAttempt.vehicleUsed && searchAttempt.searchedPlanet) {
            readyWidgetCount++;
            totalTimeTaken += (searchAttempt.searchedPlanet.distance / searchAttempt.vehicleUsed.speed);
          }          
      }

      return {
        readyWidgetCount ,
        totalTimeTaken
      };
  }

  // selector methods

  private getVehicleList() : IVehicle[] {

    return _state.vehicleList;
  }

  private getPlanetList() : IPlanet[] {

    return _state.planetList;
  }

  

  private unselectedPlanetsSelector = function getUnselectedPlanets(state : IFalconAppState) : IPlanet[]{

    return state.planetList.filter(
      p => !p.includedInSearch
    );
  }

  private getVehicleByName(vehicleName : string) : IVehicle {

    if(vehicleName) {
      return this.getVehicleList().find( v => v.name === vehicleName);
    }
    return null;
  }

  private getPlanetByName(planetName : string) : IPlanet {

    if(planetName) {
      return this.getPlanetList().find( p => p.name === planetName);
    }
    return null;
  }

  private getSearchMap() : Map<string, ISearchAttempt> {

    return _state.searchMap;
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
        this.setAppState({..._state,
            planetList,
            vehicleList
        });          
    },
      (error) => {
        this.updateError(error);
      }
    );
  }

  
  public updatePlanetList(planetList : IPlanet[]) : void {
    
    this.setAppState({ ..._state, planetList})
  } 

  public markPlanetForSearch(planet : IPlanet) {    
    
    const updatedPlanetList : IPlanet[] = this.getPlanetList().map(
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
            
      const existingSearchAttempt = this.getSearchMap().get(vehicleSelectionParam.widgetId);
      
      let existingVehicle = null;

      if(existingSearchAttempt) {
        existingVehicle = existingSearchAttempt.vehicleUsed;         
      }
      
      const updatedVehicleList = this.getVehicleList().map(
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

    this.setAppState({ ..._state, vehicleList});    
  }  

  public updateSearchData(widgetId : string, searchAttempt : ISearchAttempt) : void {
    
    if(!searchAttempt)
    {
      return;
    }

    // step 1 : update the search attempt map to reflect latest UI selections
    const searchMap =  new Map<string, ISearchAttempt>(this.getSearchMap());    
    
    const existingSearchAttempt = searchMap.get(widgetId);

    // initialize searchAttemptToBeUpdated with existing data if any
    const searchAttemptToBeUpdated = <ISearchAttempt>{ ...existingSearchAttempt };
    
    // if(existingSearchAttempt) {
      
    //   if(existingSearchAttempt.searchedPlanet) {
    //     searchAttemptToBeUpdated.searchedPlanet = existingSearchAttempt.searchedPlanet;
    //   }

    //   if(existingSearchAttempt.vehicleUsed) {
    //     searchAttemptToBeUpdated.vehicleUsed = existingSearchAttempt.vehicleUsed;
    //   }
    // }

    if(searchAttempt.searchedPlanet) {
      searchAttemptToBeUpdated.searchedPlanet = this.getPlanetByName(searchAttempt.searchedPlanet.name);
    }

    if(searchAttempt.vehicleUsed) {
      searchAttemptToBeUpdated.vehicleUsed = this.getVehicleByName(searchAttempt.vehicleUsed.name);  
    }
    
    searchMap.set(widgetId,  searchAttemptToBeUpdated);
            
    // step 2 : Identify if we have required search criteria to be able to call findFalcone api method
    const readyState = this.getReadyWidgetState(searchMap);
    
    let isReadyToSearch = false;
    
    if(searchMap.size === _state.maxSearchAttemptAllowed){
      
      let countReadyWidgets = readyState.readyWidgetCount;

      if(countReadyWidgets === _state.maxSearchAttemptAllowed)
      {
        isReadyToSearch = true;
      }
      
    }
    
    // update total time taken in the state
    const totalTimeTaken = readyState.totalTimeTaken;

    this.setAppState({..._state, searchMap, isReadyToSearch, totalTimeTaken});
  }  

  public updateTotalTimeTaken(totalTimeTaken : number) {

    this.setAppState({ ..._state, totalTimeTaken});    
  }          

  public findFalcon(request : IFindFalconRequest) {

     request.token = this.finderApiToken; 
     this.finderService.findFalcon(request)
        .subscribe( (response: IFindFalconResponse) => {
          let errorMsg = null;  
          if(response) {

            if(response.error) {
              errorMsg = response.error;
              this.updateError(errorMsg);
            }
            else if(response.status) {

              if(response.status.trim().toLowerCase() === "success") {

                if(response.planetName) {
                  this.updatePlanetFoundOn(response.planetName);
                }
                else {
                  errorMsg = "Search api returned empty planet name";
                  this.updateError(errorMsg);
                }
              }
              else if(response.status.trim().toLocaleLowerCase() === "false") {
                errorMsg = "Failure! You were unable to find Falcone. Better luck next time.";
                this.updateError(errorMsg);
              }
              else {
                errorMsg = "Search api did not return a response status value."
                this.updateError(errorMsg);
              }
            }
          }
          else {
            errorMsg = "Search api returned invalid response."
            this.updateError(errorMsg);
          }
        },
        (error) => {
          this.updateError(error);
        }
        );
  }  

}
