import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { IPlanet } from './models/planet';
import { BehaviorSubject, forkJoin, Subject, combineLatest } from 'rxjs';
import { IVehicle } from './models/vehicle';
import { IFindFalconResponse } from './models/find-falcon-response';
import { IFindFalconRequest } from './models/find-falcon-request';
import { FalconFinderService } from './falcon-finder.service';
import { ISearchAttempt } from './models/searchAttempt';
import { IFalconAppState } from './models/falconApp.state';
import { map, distinctUntilChanged, withLatestFrom, distinct} from 'rxjs/operators';
import { Router } from '@angular/router';
import PlanetChange from './models/planetChange';
import VehicleChange from './models/vehicleChange';

@Injectable({
  providedIn: 'root'
})
export class FinderFacadeService {
  
  constructor(private planetService : PlanetsService,
              private vehicleService : VehiclesService,
              private finderService : FalconFinderService,              
              private router : Router) { }


  private finderApiToken : string;          
  private readonly MAX_SEARCH_ATTEMPTS_ALLOWED = 4;
  private _state : IFalconAppState = {
    errorMsg : "",
    isLoading : false,
    maxSearchAttemptAllowed : this.MAX_SEARCH_ATTEMPTS_ALLOWED,
    planetList : [],
    searchMap : null,
    availablePlanetListMap : null,
    availableVehicleListMap : null, 
    totalTimeTaken : 0,
    vehicleList : [],
    planetFoundOn : null,
    isReadyToSearch : false,
    lastUpdatedWidgetId: null    
  };            
  
  private store = new BehaviorSubject<IFalconAppState>(this._state);
     
  private store$ = this.store.asObservable();  
  
  private error$ = this.store$.pipe(map(state => state.errorMsg));

  private planetList$ = this.store$.pipe(map(state => state.planetList), distinctUntilChanged());  

  private vehicleList$ = this.store$.pipe(map(state => state.vehicleList), distinctUntilChanged());  

  private searchAttemptMap$ = this.store$.pipe(map(state => state.searchMap), distinctUntilChanged());

  private totalTimeTaken$ = this.store$.pipe(map(state => state.totalTimeTaken), distinctUntilChanged());

  public planetFoundOn$ = this.store$.pipe(map(state => state.planetFoundOn), distinctUntilChanged());

  private readyToSearch$ = this.store$.pipe(map( state => state.isReadyToSearch), distinctUntilChanged());

  public lastUpdatedWidgetId$ = this.store$.pipe(map( state => state.lastUpdatedWidgetId), distinctUntilChanged());

  public availablePlanetListUpdated$ = this.store$.pipe(map( state =>  state.availablePlanetListMap), distinctUntilChanged());

  public availableVehicleListUpdated$ = this.store$.pipe(map( state =>  state.availableVehicleListMap), distinctUntilChanged());

  private maxCountPlanetsToBeSearched$ = this.store$.pipe( map(state => state.maxSearchAttemptAllowed), distinctUntilChanged());
  private widgetInputChangedEvent$ = new Subject<void>();        

  private isLoading$ = this.store$.pipe(map(state => state.isLoading), distinctUntilChanged());  
  
  public dashboardVm$ = combineLatest([this.error$,  this.totalTimeTaken$, this.readyToSearch$, this.isLoading$, this.maxCountPlanetsToBeSearched$])
      .pipe(map(([error, totalTimeTaken, isReadyForSearch, isLoading, maxCountPlanetsToBeSearched]) => {
        return {
          error,          
          totalTimeTaken,
          isReadyForSearch,
          isLoading,
          maxCountPlanetsToBeSearched
        };
      }));    
  
  // public planetVm$ = combineLatest([this.availablePlanetListUpdated$, this.lastUpdatedWidgetId$])
  //     .pipe(map(([widgetIdToPlanetListMap, lastUpdatedWidgetId]) => {
  //         return {            
  //           widgetIdToPlanetListMap,
  //           lastUpdatedWidgetId
  //         };      
  //     }));

  //   public vehicleVm$ = combineLatest([this.availableVehicleListUpdated$, this.lastUpdatedWidgetId$])
  //   .pipe(map(([widgetIdToVehicleListMap, lastUpdatedWidgetId]) => {
  //       return {          
  //         widgetIdToVehicleListMap,
  //         lastUpdatedWidgetId
  //       };      
  //   }));
  
  public initializeAppData() {
    this.setLoadingFlag(true);
    forkJoin(
      this.vehicleService.getAllVehicles(),
      this.planetService.getAllPlanets(),
      this.finderService.getFalconFinderApiToken()
    )
    .subscribe( response => {
      this.setLoadingFlag(false);
        this.finderApiToken = response[2].token;
        const vehicleList : IVehicle[] = response[0];
        const planetList : IPlanet[] = response[1];
        
        // todo handle error scenarios
        this.updateState({...this._state,
            planetList,
            vehicleList,
            searchMap : this.getInitializedSearchMap(planetList, vehicleList),
            availablePlanetListMap : this.getMapWithAllPlanets(planetList),
            availableVehicleListMap : this.getMapWithAllVehicles(vehicleList)            
        });          
    },
      (error) => {
        this.updateError(error);
        this.setLoadingFlag(false);
      }
    );
  }       
     
  private getInitializedSearchMap(planetList, vehicleList) : Map<string, ISearchAttempt> {
    const searchMap = new Map<string, ISearchAttempt>();

    for(let index = 0; index < this.MAX_SEARCH_ATTEMPTS_ALLOWED; index++) {
      searchMap.set(index.toString(), <ISearchAttempt>{});
    }
    return searchMap;
  }

  private getMapWithAllPlanets(planetList: IPlanet[]): Map<string, IPlanet[]> {
    const planetsMap = new Map<string, IPlanet[]>();

    for(let index = 0; index < this.MAX_SEARCH_ATTEMPTS_ALLOWED; index++) {
      planetsMap.set(index.toString(), planetList);
    }
    return planetsMap;
  }

  private getMapWithAllVehicles(vehicleList: IVehicle[]): Map<string, IVehicle[]> {
    const vehiclesMap = new Map<string, IVehicle[]>();

    for(let index = 0; index < this.MAX_SEARCH_ATTEMPTS_ALLOWED; index++) {
      vehiclesMap.set(index.toString(), vehicleList);
    }
    return vehiclesMap;
  }
  
  public planetChanged(planetChange : PlanetChange) {
    const changedWidgetId = planetChange.widgetId.toString();
    let existingSearchAttempt : ISearchAttempt = this._state.searchMap.get(changedWidgetId);
    // shallow copying existing map is just fine, since we will assign a new value object
    // and value objects for other keys are not changing
    let searchMap = new Map<string, ISearchAttempt>(this._state.searchMap);

    let updatedSearchAttempt = <ISearchAttempt>{        
      ...existingSearchAttempt,
      searchedPlanet : {...planetChange.newPlanet}, 
      vehicleUsed : null        
    }
    searchMap.set(changedWidgetId, updatedSearchAttempt);

    this.updateState({
      ...this._state, 
      lastUpdatedWidgetId : planetChange.widgetId, 
      searchMap : searchMap
    });
    
    this.widgetInputChangedEvent$.next();
  }


  public vehicleChanged(vehicleChange : VehicleChange) {

    const changedWidgetId = vehicleChange.widgetId.toString();
    let existingSearchAttempt : ISearchAttempt = this._state.searchMap.get(changedWidgetId);

    // shallow copying existing map is just fine, since we will assign a new value object
    // and value objects for other keys are not changing
    let searchMap = new Map<string, ISearchAttempt>(this._state.searchMap);
    const key = vehicleChange.widgetId.toString();
    
    let updatedSearchAttempt = <ISearchAttempt>{
      ...existingSearchAttempt,
      searchedPlanet : { ...searchMap.get(key).searchedPlanet},
      vehicleUsed : {...vehicleChange.newVehicle}
    };

    searchMap.set(
      vehicleChange.widgetId.toString(), 
      updatedSearchAttempt
    );

    this.updateState({
      ...this._state, 
      lastUpdatedWidgetId : vehicleChange.widgetId, 
      searchMap : searchMap
    });

    this.widgetInputChangedEvent$.next();
  }  
  
  private updatePlanetFoundOn(planetFoundOn : string) {
    this.updateState({...this._state, planetFoundOn});
  }     

  private widgetChangesSubscription = this.widgetInputChangedEvent$.pipe(
    withLatestFrom(this.searchAttemptMap$, this.availablePlanetListUpdated$, this.availableVehicleListUpdated$, this.planetList$, this.vehicleList$, this.lastUpdatedWidgetId$)    
  )
  .subscribe(([_, searchMap, widgetIdToPlanetListMap, widgetIdToVehicleListMap, planetList, vehicleList, lastUpdatedWidgetId]) => {

    // reset the widgets that are to the right of currently changed widget
    // all the widgets with id > widgetId are to the right, and their existing selections would be reset
    const updatedSearchMapAfterWidgetResets : Map<string, ISearchAttempt> 
      = this.getUpdatedSearchMapAfterWidgetResets(searchMap, lastUpdatedWidgetId); 

    // update the cloned search map with planet list to be shown for each widget
    const updatedWidgetIdToAvailablePlanetsMap : Map<string, IPlanet[]> = 
      this.updateWidgetIdToAvailablePlanetsMap(updatedSearchMapAfterWidgetResets, widgetIdToPlanetListMap, planetList, lastUpdatedWidgetId);

    // update the cloned search map with vehicle list to be shown for each widget
    const updatedWidgetIdToAvailableVehiclesMap : Map<string, IVehicle[]> = 
      this.updateWidgetIdToAvailableVehicleMap(updatedSearchMapAfterWidgetResets, widgetIdToVehicleListMap, vehicleList, lastUpdatedWidgetId);    
    
    // calculate the total time taken to search planets with vehicles selected
    const totalTimeTakenForSearch : number = this.getTotalTimeTakenForSearch(updatedSearchMapAfterWidgetResets);

    const isReadyToSearch : boolean = this.isItFineToStartSearching(updatedSearchMapAfterWidgetResets);
    // update the application state to reflect latest changes
    this.updateState({
      ...this._state, 
      searchMap : updatedSearchMapAfterWidgetResets, 
      availablePlanetListMap : updatedWidgetIdToAvailablePlanetsMap,
      availableVehicleListMap : updatedWidgetIdToAvailableVehiclesMap,
      totalTimeTaken : totalTimeTakenForSearch,
      isReadyToSearch : isReadyToSearch
    });
  });  
  
  private getUpdatedSearchMapAfterWidgetResets(searchMap: Map<string, ISearchAttempt>, lastChangedWidgetId: number): Map<string, ISearchAttempt> {
    let updatedSearchMap = new Map<string, ISearchAttempt>();

    searchMap.forEach((value: ISearchAttempt, key: string) => {
      let updatedSearchAttempt : ISearchAttempt ;
      // if the current widget is to the left of changed widget or the changed widget then
      // just make a clone for immutability and continue
      const currentlyLoopedWidgetId = Number(key);
      if(currentlyLoopedWidgetId <= lastChangedWidgetId ){
        updatedSearchAttempt = <ISearchAttempt>{ ...value};
      }      
      else {
       // else if the current widget is to the right of the changed widget then
       // we will need to reset both the existing planet and vehicle selections if any
       updatedSearchAttempt = <ISearchAttempt>{ vehicleUsed: null, searchedPlanet : null};
      }

      updatedSearchMap.set(key, updatedSearchAttempt);      
    });

    return updatedSearchMap;
  } 

  // private updateWidgetIdToAvailablePlanetsMap(searchMap: Map<string, ISearchAttempt>, planetList : IPlanet[])
  //           : Map<string, IPlanet[]> {

  //   const usedPlanets = new Set<string>();
  //   const updatedPlanetsMap = new Map<string, IPlanet[]>();
  //   searchMap.forEach((value: ISearchAttempt, key: string) => {
  //       const planet : IPlanet = value.searchedPlanet;        
        
  //       const availablePlanets = planetList.filter( (currentPlanet: IPlanet) => {
  //         return !usedPlanets.has(currentPlanet.name);
  //       });        
  //       usedPlanets.add(planet.name);
  //       updatedPlanetsMap.set(key, [...availablePlanets]);
  //   });

  //   return updatedPlanetsMap;
  // }
  private updateWidgetIdToAvailablePlanetsMap(searchMap: Map<string, ISearchAttempt>, widgetIdToPlanetListMap : Map<string, IPlanet[]>, lastUpdatedWidgetId: number, planetList : IPlanet[])
            : Map<string, IPlanet[]> {

    const usedPlanets = new Set<string>();
    const updatedPlanetsMap = new Map<string, IPlanet[]>();
    widgetIdToPlanetListMap.forEach((value: IPlanet[], key: string) => {
        
        const planet : IPlanet = searchMap.get(key).searchedPlanet;        
        const widgetId = +key;
        if(widgetId < lastUpdatedWidgetId) {

          updatedPlanetsMap.set(key, [...value]);  
        }
        else {
          const availablePlanets = planetList.filter( (currentPlanet: IPlanet) => {
            return !usedPlanets.has(currentPlanet.name);
          });   
          updatedPlanetsMap.set(key, [...availablePlanets]);
        }
             
        usedPlanets.add(planet.name);
        
    });

    return updatedPlanetsMap;
  }

  private updateWidgetIdToAvailableVehicleMap(searchMap: Map<string, ISearchAttempt> , widgetIdToVehiclesMap: Map<string, IVehicle[]>, vehicleList : IVehicle[], lastUpdatedWidgetId: number)
            : Map<string, IVehicle[]> {          
    
    // create a map of vehicle name vs count of vehicles used
    const usedVehicleMap = this.getUsedVehicleMap(searchMap); 

    // update vehicle list with available vehicle units
    let updatedVehicleList : IVehicle[] = vehicleList.map(vehicle => {              
      return <IVehicle>{...vehicle, availNumUnits: usedVehicleMap.get(vehicle.name)};                            
    });            
    
    return this.getWidgetIdToUpdatedVehiclesMap(widgetIdToVehiclesMap, lastUpdatedWidgetId, updatedVehicleList);
  }  

  private getUsedVehicleMap(searchMap: Map<string, ISearchAttempt>) :  Map<string, number> {
    
    const usedVehicleMap = new Map<string, number>();
    for (let index = 0; index < searchMap.size; index++) {
      const key = index.toString();
      const searchAttempt: ISearchAttempt = searchMap.get(key);
      if (searchAttempt) {
        const vehicle: IVehicle = searchAttempt.vehicleUsed;
        if (vehicle) {
          let count: number = usedVehicleMap.get(vehicle.name);
          if (Number(count)) {
            usedVehicleMap.set(vehicle.name, count++);
          }
          else {
            usedVehicleMap.set(vehicle.name, 1);
          }
        }
      }
    }
    return usedVehicleMap;
  }

  private getWidgetIdToUpdatedVehiclesMap(
    widgetIdToVehiclesMap: Map<string, IVehicle[]>, 
    lastUpdatedWidgetId: number, 
    updatedVehicleList: IVehicle[]) 
                                        : Map<string, IVehicle[]> 
  {
    const usedVehicleMap = new Map<string, IVehicle[]>();
    // update the search map with the updatedVehicleList
    widgetIdToVehiclesMap.forEach((value: IVehicle[], key: string) => {
      const currentlyLoopedWidgetId = Number(lastUpdatedWidgetId);
      if (currentlyLoopedWidgetId >= lastUpdatedWidgetId) {
        usedVehicleMap.set(key, [...updatedVehicleList]);
      }
      else {
        usedVehicleMap.set(key, [...value]);
      }
    });
    return usedVehicleMap;
  }

  private getTotalTimeTakenForSearch(searchMap: Map<string, ISearchAttempt>): number {
    
    let totalTimeTakenForSearch : number = 0;

    searchMap.forEach((value: ISearchAttempt) => {
      if(!value){        
        return;
      }

      if(!value.searchedPlanet || !value.vehicleUsed) {
        return;
      }

      const planetDistance = value.searchedPlanet.distance;
      const vehicleSpeed = value.vehicleUsed.speed;
      if(!planetDistance || !vehicleSpeed) {
        return;
      }
      
      totalTimeTakenForSearch = totalTimeTakenForSearch + planetDistance / vehicleSpeed; 

    });

    return totalTimeTakenForSearch;
  }
  
  private isItFineToStartSearching(searchMap: Map<string, ISearchAttempt>): boolean {
    let isReadyForSearch : boolean = true;

    searchMap.forEach((value : ISearchAttempt) => {
      if(!value){        
        isReadyForSearch = false;
        return;
      }

      if(!value.searchedPlanet || !value.vehicleUsed) {
        isReadyForSearch = false;
        return;
      }

    });

    return isReadyForSearch;
  }

  public findFalcon(request : IFindFalconRequest) {

    this.setLoadingFlag(true);

     request.token = this.finderApiToken; 
     this.finderService.findFalcon(request)
        .subscribe( (response: IFindFalconResponse) => {

          this.setLoadingFlag(false);
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
          this.setLoadingFlag(false);
        }
        );
  }
  
  resetApp(){
    this.router.navigate(['/finderboard/reset']);
  }

  private setLoadingFlag(isLoading : boolean) : void {
    this.updateState({...this._state, isLoading : isLoading || false});
  }

  public updateError(errorMsg: string) {
    this.updateState({...this._state, errorMsg});
  }

  private updateState(state : IFalconAppState) {
    
    this.store.next(this._state = state);
  }     
}
