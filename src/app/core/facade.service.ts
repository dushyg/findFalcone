import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { FalconFinderService } from './falcon-finder.service';
import { Router } from '@angular/router';
import { IFindFalconRequest } from './models/find-falcon-request';
import { IFindFalconResponse } from './models/find-falcon-response';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { Subject, EMPTY, BehaviorSubject, Observable, combineLatest, forkJoin } from 'rxjs';
import PlanetChange from './models/planetChange';
import VehicleChange from './models/vehicleChange';
import PlanetUpdates from './models/planetUpdates';
import { IPlanet } from './models/planet';
import { IVehicle } from './models/vehicle';
import VehicleUpdates from './models/vehicleUpdates';
import { ISearchAttempt } from './models/searchAttempt';

@Injectable({providedIn : 'root'})
export default class FalconeFacade {
        
    constructor(private planetService : PlanetsService,
                private vehicleService : VehiclesService,
                private finderService : FalconFinderService,
                private router : Router){
        
    }

    private finderApiToken : string;   

    private searchMapSubject = new Subject<Map<number, ISearchAttempt>>();
    public searchMap$ : Observable<Map<number, ISearchAttempt>> = this.searchMapSubject.asObservable();

    private readonly MAX_SEARCH_ATTEMPTS_ALLOWED = 4; 
    private maxSearchAttemptAllowedSubject = new BehaviorSubject<number>(this.MAX_SEARCH_ATTEMPTS_ALLOWED);    
    public maxSearchAttemptAllowed$ : Observable<number> = this.maxSearchAttemptAllowedSubject.asObservable();

    private errorMessageSubject = new Subject<string>();
    public errorMessage$ : Observable<string> = this.errorMessageSubject.asObservable();

    private apiVehiclesSubject = new Subject<IVehicle[]>();
    public apiVehicles$ : Observable<IVehicle[]> = this.apiVehiclesSubject.asObservable();

    private vehiclesSubject = new Subject<IVehicle[]>();
    public vehicles$ : Observable<IVehicle[]> = this.vehiclesSubject.asObservable();


    private apiPlanetsSubject = new Subject<IPlanet[]>();
    public apiPlanets$ : Observable<IPlanet[]> = this.apiPlanetsSubject.asObservable();

    private planetsSubject = new Subject<IPlanet[]>();
    public planets$ : Observable<IPlanet[]> = this.planetsSubject.asObservable();


    private totalTimeTakenSubject = new BehaviorSubject<number>(0);    
    public totalTimeTaken$ : Observable<number> = this.totalTimeTakenSubject.asObservable();

    private planetFoundOnSubject = new BehaviorSubject<string>('');
    public planetFoundOn$ : Observable<string> = this.planetFoundOnSubject.asObservable();
    
    private planetChangedSubject = new Subject<PlanetChange>(); 
    private planetChangedAction$ : Observable<PlanetChange> = this.planetChangedSubject.asObservable();
    public planetChanged(planetChange : PlanetChange) {
        this.planetChangedSubject.next(planetChange);
    }
    
    private vehicleChangedSubject = new Subject<VehicleChange>(); 
    private vehicleChangedAction$ : Observable<VehicleChange> = this.vehicleChangedSubject.asObservable();
    public vehicleChanged(vehicleChange : VehicleChange) {
        this.vehicleChangedSubject.next(vehicleChange);
    }
    
    public vehiclesUpdated$ = this.vehicleChangedAction$.pipe( 
        withLatestFrom(this.vehicles$, this.searchMap$),
        map(([vehicleChange, vehicles, searchMap]) => {

            const updatedVehicles = this.getVehicleListWithUpdatedAvailableUnits(vehicleChange, vehicles);                            
            this.updateVehicleInfo(updatedVehicles);            
            return {widgetId : vehicleChange.widgetId, changer : 'vehicleUpdate'};
        })
    )
  
    private getVehicleListWithUpdatedAvailableUnits(vehicleChange: VehicleChange, vehicles: IVehicle[]): IVehicle[] {
        
         // if vehicle is being set for the first time, decrement avail qty
         // if vehicle is being updated, increment previously decremented vehicle qty, decrement current vehicle qty
         // return updated vehile array
        return vehicles.map( vehicle => {

            const clonedVehicle = {...vehicle};

            if(vehicleChange && vehicleChange.newVehicle && vehicleChange.newVehicle.name === clonedVehicle.name) {
                clonedVehicle.availNumUnits = clonedVehicle.availNumUnits - 1;
            }

            if(vehicleChange && vehicleChange.oldVehicle && vehicleChange.oldVehicle.name === vehicle.name) {
                clonedVehicle.availNumUnits = clonedVehicle.availNumUnits + 1;
            }

            return clonedVehicle;
        });

    }

    private updateVehicleInfo(updatedVehicles: IVehicle[]): void {
        
        this.vehiclesSubject.next(updatedVehicles);
    }

    public planetsUpdated$ = this.planetChangedAction$
            .pipe(withLatestFrom(this.planets$, this.searchMap$),
                  map(([planetChange, planets, searchMap]) => {

                        console.log('planetChangedAction$.pipe(withLatestFrom(this.planets$)',planetChange, planets, searchMap);
                        const updatedSearchMap = this.getUpdatedSearchMap(planetChange, searchMap);
                        this.setUpdatedSearchMap(updatedSearchMap);
                        const planetsLeftForSearch = this.getPlanetsAvailableForSearch(planets, updatedSearchMap);                                    
                        this.updatePlanetListForAvailability(planetsLeftForSearch);
                        return {widgetId : planetChange.widgetId, changer : 'planetUpdate'};

                  })
            );

    private getUpdatedSearchMap(planetChange: PlanetChange, searchMap: Map<number, ISearchAttempt>): Map<number, ISearchAttempt> {
        const newSearchMap = new Map<number, ISearchAttempt>();

        // if there are any existing searchAttempts then
        // include searchAttempts to the left of currently changed widget 
        // exclude searchAttempts to thte right of currently changed widget
        // include searchAttempt for the currently changed widget
        if(searchMap.size > 0) {            
           searchMap.forEach( (searchAttempt, widgetId) => {
               // this is the searchAttempt for widget to the left of the changed widget and it should be retained
                if(planetChange.widgetId > widgetId){

                    const unchangedSearchAttemptClone = { ...searchAttempt};
                    newSearchMap.set(widgetId, unchangedSearchAttemptClone);
                }
                else if(planetChange.widgetId === widgetId) {
                    // only include the searchAttempt for currently changed widget
                    // if a valid planet is selected 
                    if(planetChange.newPlanet.name !== 'Select') {
                        newSearchMap.set(
                            widgetId, 
                            {
                                searchedPlanet : {...planetChange.newPlanet}, 
                                vehicleUsed : null
                            }
                        );
                    }                    
                }
                // else no action 
                // (exclude any searchAttempts for widgets to the right of currently changed widget)

           }); 
        }
        else // if there are no map entries, this is the first planet being selected, simply add a new entry to the search map 
            if(planetChange.newPlanet.name){
                searchMap.set(planetChange.widgetId,
                            <ISearchAttempt>{ 
                                searchedPlanet : {...planetChange.newPlanet},
                                vehicleUsed: null
                                }
                            );
        }

        return newSearchMap;
    }              

    private setUpdatedSearchMap(searchMap: Map<number, ISearchAttempt>) : void {
        this.searchMapSubject.next(searchMap);
    }

    private updatePlanetListForAvailability(planets : IPlanet[]) : void {

        this.planetsSubject.next(planets);
    }
    
    private getPlanetsAvailableForSearch(planets: IPlanet[], searchMap : Map<number, ISearchAttempt>)  : IPlanet[] {       
       
        if(searchMap.size > 0) {

            const planetsIncludedInSearch = new Set<string>();

            for(let searchAttempt of searchMap) {
                //searchAttempt is an array with index 0 being the widget id and index 1 being searchAttempt
                planetsIncludedInSearch.add(searchAttempt[1].searchedPlanet.name)
            }
        
            const planetsAvailableForSearch = planets.filter( planet => {                    
                    // if the planet is part of planetsIncludedInSearch set then filter it out                    
                    return !planetsIncludedInSearch.has(planet.name);
                });
        
            return [...planetsAvailableForSearch];
        }
        else {
            return [...planets];
        }
                        
    }           

    // todo remove, just for testing
    public some$ = combineLatest([this.planets$, this.planetChangedAction$])
    .pipe(
        map(([planets, planetChange]) => {
            
            console.log('combinelatest [this.planets$, this.planetChangedAction$]',planets, planetChange);
            return new PlanetUpdates(planets, planetChange, null);
            
        })
    )
    
    
    public isReadyForSearch$ = this.searchMap$.pipe(
        map(searchMap => {
            // if searchMap contains required entries then return true		
            if(searchMap && searchMap.entries.length === this.MAX_SEARCH_ATTEMPTS_ALLOWED) {
                for(let entry of searchMap){
                    if(!entry[1] ||
                        (entry[1] && (!entry[1].searchedPlanet || entry[1].vehicleUsed))) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        })
    )

    public initializeAppData() {

        forkJoin(
          this.vehicleService.getAllVehicles(),
          this.planetService.getAllPlanets(),
          this.finderService.getFalconFinderApiToken()
        )
        .pipe(
            catchError(
                error => {
                    this.setErrorMsg(error);
                    return EMPTY;
                }
            )
        )
        .subscribe( response => {
                      
            const vehicleList : IVehicle[] = response[0];
            const planetList : IPlanet[] = response[1];
            this.finderApiToken = response[2].token;

            this.apiVehiclesSubject.next(vehicleList);
            this.vehiclesSubject.next(vehicleList);

            this.apiPlanetsSubject.next(planetList);    
            this.planetsSubject.next(planetList);    
        },
          (error) => {
            this.setErrorMsg(error);
          }
        );
    }      
        
    public findFalcon(request : IFindFalconRequest) {

        request.token = this.finderApiToken; 
        this.finderService.findFalcon(request)
           .subscribe( (response: IFindFalconResponse) => {
             let errorMsg = null;  
             if(response) {
   
               if(response.error) {
                 errorMsg = response.error;
                 this.setErrorMsg(errorMsg);
               }
               else if(response.status) {
   
                 if(response.status.trim().toLowerCase() === "success") {
   
                   if(response.planetName) {
                     this.planetFoundOnSubject.next(response.planetName);
                   }
                   else {
                     errorMsg = "Search api returned empty planet name";
                     this.setErrorMsg(errorMsg);
                   }
                 }
                 else if(response.status.trim().toLocaleLowerCase() === "false") {
                   errorMsg = "Failure! You were unable to find Falcone. Better luck next time.";
                   this.setErrorMsg(errorMsg);
                 }
                 else {
                   errorMsg = "Search api did not return a response status value."
                   this.setErrorMsg(errorMsg);
                 }
               }
             }
             else {
               errorMsg = "Search api returned invalid response."
               this.setErrorMsg(errorMsg);
             }
           },
           (error) => {
            this.setErrorMsg(error);
           }
           );
     }    

    private setErrorMsg(error) {
        this.errorMessageSubject.next(error);
    }

     resetApp(){
        this.router.navigate(['/finderboard/reset']);
      }      
}