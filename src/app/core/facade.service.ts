import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { FalconFinderService } from './falcon-finder.service';
import { Router } from '@angular/router';
import { IFindFalconRequest } from './models/find-falcon-request';
import { IFindFalconResponse } from './models/find-falcon-response';
import { catchError, map, withLatestFrom, tap, distinctUntilChanged } from 'rxjs/operators';
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
    public getMaxSearchAttemptsAllowedCount() {
        return this.MAX_SEARCH_ATTEMPTS_ALLOWED;
    }
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
        withLatestFrom(this.apiVehicles$, this.apiPlanets$, this.searchMap$),
        map(([vehicleChange, vehicles, planets, searchMap]) => {

            // update list of vehicles with updated available units
            const vehicleUpdates : {updatedVehicles : IVehicle[], lastUpdatedVehicle: IVehicle} 
                        = this.getVehiclesWithUpdatedAvailableUnits(vehicles, vehicleChange, searchMap);
            const updatedVehicles : IVehicle[] = vehicleUpdates.updatedVehicles;
            this.updateVehicleInfo(updatedVehicles);       
            
            // update list of planets available to be searched after this change
            const updatedSearchMap = this.getUpdatedSearchMap(vehicleChange.widgetId, null, vehicleUpdates.lastUpdatedVehicle, searchMap);
            this.setSearchMap(updatedSearchMap);
            const planetsLeftForSearch = this.getPlanetsAvailableForSearch(planets, updatedSearchMap);                                    
            this.updatePlanetListForAvailability(planetsLeftForSearch);
            console.log(`vehiclesUpdated$ -> vehicleChangedAction$ withLatestFrom`,updatedSearchMap);
            return {widgetId : vehicleChange.widgetId, changer : 'vehicleUpdate'};
        })
    )     
    
    public planetsUpdated$ = this.planetChangedAction$
            .pipe(withLatestFrom(this.apiPlanets$, this.apiVehicles$, this.searchMap$),
                  map(([planetChange, planets, vehicles, searchMap]) => {

                        

                        // update list of planets available to be searched after this change
                        const updatedSearchMap = this.getUpdatedSearchMap(planetChange.widgetId, planetChange.newPlanet, null, searchMap);
                        this.setSearchMap(updatedSearchMap);
                        const planetsLeftForSearch = this.getPlanetsAvailableForSearch(planets, updatedSearchMap);                                    
                        this.updatePlanetListForAvailability(planetsLeftForSearch);

                        // update list of vehicles with updated available units
                        const vehicleUpdates : {updatedVehicles : IVehicle[], lastUpdatedVehicle: IVehicle}
                                             = this.getVehiclesWithUpdatedAvailableUnits(vehicles, <VehicleChange>{ widgetId : planetChange.widgetId}, updatedSearchMap);
                        
                        const vehiclesWithUpdatedAvailableUnits: IVehicle[] = vehicleUpdates.updatedVehicles;
                        this.updateVehicleInfo(vehiclesWithUpdatedAvailableUnits);
                        console.log(`planetsUpdated$ -> withLatestFrom`,updatedSearchMap);
                        return {widgetId : planetChange.widgetId, changer : 'planetUpdate'};

                  })
            );

    
    private updateVehicleInfo(updatedVehicles: IVehicle[]): void {

        this.vehiclesSubject.next(updatedVehicles);
    }

    private getUpdatedSearchMap(changedWidgetId: number, changedWidgetPlanet: IPlanet, changedWidgetVehicle : IVehicle, searchMap: Map<number, ISearchAttempt>): Map<number, ISearchAttempt> {
        const newSearchMap = new Map<number, ISearchAttempt>();

        if(!changedWidgetPlanet) {
            changedWidgetPlanet = searchMap.get(changedWidgetId).searchedPlanet;
        }

        //const widgetId = planetChange.widgetId;
        // if there are any existing searchAttempts then
        // include searchAttempts to the left of currently changed widget         
        if(searchMap.size > 0) {            
           searchMap.forEach( (searchAttempt, widgetId) => {
               // this is the searchAttempt for widget to the left of the changed widget and it should be retained
                if(changedWidgetId > widgetId){

                    const unchangedSearchAttemptClone = { ...searchAttempt};
                    newSearchMap.set(widgetId, unchangedSearchAttemptClone);
                }                
           }); 
        }

        // this is the first planet being selected, simply add a new entry to the search map 
        if(changedWidgetPlanet && changedWidgetPlanet.name && changedWidgetPlanet.name !== 'Select'){
            newSearchMap.set(changedWidgetId,
                        <ISearchAttempt>{ 
                            searchedPlanet : {...changedWidgetPlanet},
                            vehicleUsed: changedWidgetVehicle
                            }
                        );
        }

        return newSearchMap;
    }              

    getVehiclesWithUpdatedAvailableUnits(vehicles : IVehicle[], vehicleChange: VehicleChange, searchMap: Map<number, ISearchAttempt>)
                : {updatedVehicles : IVehicle[], lastUpdatedVehicle: IVehicle} 
    {
    
        const updates = {updatedVehicles : null, lastUpdatedVehicle: null};
        let lastUpdatedVehicle : IVehicle;
        const updatedWidgetId = vehicleChange.widgetId;

        // Create a map which will store the updated available units of vehicles against vehicle name
        const vehiclesInUseMap = new Map<string, IVehicle>();
        for(let searchAttemptEntry of searchMap){
            // searchAttemptEntry is an array that has widgetId at index 0 and has serchAttempt at index 1
            const widgetId = searchAttemptEntry[0];
            const vehicleUsed = searchAttemptEntry[1].vehicleUsed; 

            // If current widget is to the left of updated widget
            // the available unit count for the vehicle used in that widget wont change
            if(widgetId < updatedWidgetId){
                if(vehicleUsed) {
                    lastUpdatedVehicle = {...vehicleUsed};
                    vehiclesInUseMap.set(vehicleUsed.name, lastUpdatedVehicle);
                }                
            }
            // We free up one unit from vehicle that was used earlier 
            // and decrease one unit from the newly selected vehicle.
            // If the control reaches here due to planet being updated in which case oldVehicle and newVehicle will be null 
            // then this widget slot will not have any vehicles
            else if(widgetId === updatedWidgetId){                
                    if(vehicleChange.oldVehicle && vehicleChange.oldVehicle.name) {
                        lastUpdatedVehicle = <IVehicle>{ ...vehicleChange.oldVehicle, availNumUnits : vehicleChange.oldVehicle.availNumUnits + 1};
                        vehiclesInUseMap.set(vehicleChange.oldVehicle.name, lastUpdatedVehicle);
                    }
                    if(vehicleChange.newVehicle && vehicleChange.newVehicle.name) {
                        lastUpdatedVehicle = <IVehicle>{ ...vehicleChange.newVehicle, availNumUnits : vehicleChange.newVehicle.availNumUnits - 1};
                        vehiclesInUseMap.set(vehicleChange.newVehicle.name, lastUpdatedVehicle);
                    }                
            }   
            // for all the widgets to the right of the updated widgets we can simply free up all the used units of the vehicles
            // and set availableUnits to totalUnits
            else if(widgetId > updatedWidgetId){
                lastUpdatedVehicle = <IVehicle>{ ...vehicleUsed, availNumUnits : vehicleUsed.totalNumUnits};
                vehiclesInUseMap.set(vehicleUsed.name, lastUpdatedVehicle);
            }
        }

        // Loop over the list of 
        const updatedVehicles : IVehicle[] = vehicles.map( vehicle => {
            const existingVehicle: IVehicle = vehiclesInUseMap.get(vehicle.name);
            
            if(existingVehicle){
                return {...existingVehicle};
            }
            else {
                return {...vehicle};
            }

        });

        
        return {updatedVehicles, lastUpdatedVehicle};
    }    

    private updatePlanetListForAvailability(planets : IPlanet[]) : void {

        this.planetsSubject.next(planets);
    }
    
    private getPlanetsAvailableForSearch(planets: IPlanet[], searchMap : Map<number, ISearchAttempt>)  : IPlanet[] {       
       
        if(searchMap.size > 0) {

            const planetsIncludedInSearch = new Set<string>();

            // create a set of all planets that have already been searched (i.e are present in searchMap)
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
            if(searchMap && searchMap.size === this.MAX_SEARCH_ATTEMPTS_ALLOWED) {
                for(let entry of searchMap){
                    if(!entry[1] ||
                        (entry[1] && (!entry[1].searchedPlanet || !entry[1].vehicleUsed))) {
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
            
            // initialize/reset searchmap, error message and total time taken
            this.setSearchMap(new Map<number, ISearchAttempt>());
            this.errorMessageSubject.next('');
            this.totalTimeTakenSubject.next(0);
        },
          (error) => {
            this.setErrorMsg(error);
          }
        );

        this.searchMap$.pipe(
            tap(searchMap => {
                if(searchMap.size > 0){
                    let totalTimeTaken = 0;
                    for(let entry of searchMap){                        
                        let searchAttempt = entry[1];
                        if(searchAttempt.searchedPlanet && searchAttempt.searchedPlanet.name &&
                           searchAttempt.vehicleUsed && searchAttempt.vehicleUsed.name && searchAttempt.vehicleUsed.speed){

                                totalTimeTaken +=  (searchAttempt.searchedPlanet.distance / searchAttempt.vehicleUsed.speed);
                           }
                    }
                    this.totalTimeTakenSubject.next(totalTimeTaken);
                }
            }),
            distinctUntilChanged()
        ).subscribe( totalTime => {});

    }   
    
    private setSearchMap(searchMap: Map<number, ISearchAttempt>) : void {
        this.searchMapSubject.next(searchMap);
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