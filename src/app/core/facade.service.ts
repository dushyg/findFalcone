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

@Injectable({providedIn : 'root'})
export class FalconeFacade {    
    
    constructor(private planetService : PlanetsService,
                private vehicleService : VehiclesService,
                private finderService : FalconFinderService,
                private router : Router){
        
    }

    private finderApiToken : string;   

    private searchMapSubject = new Subject<Map<string, string>>();
    public searchMap$ : Observable<Map<string, string>> = this.searchMapSubject.asObservable();

    private readonly MAX_SEARCH_ATTEMPTS_ALLOWED = 4; 
    private maxSearchAttemptAllowedSubject = new BehaviorSubject<number>(this.MAX_SEARCH_ATTEMPTS_ALLOWED);    
    public maxSearchAttemptAllowed$ : Observable<number> = this.maxSearchAttemptAllowedSubject.asObservable();

    private errorMessageSubject = new Subject<string>();
    public errorMessage$ : Observable<string> = this.errorMessageSubject.asObservable();

    // public vehicles$ = this.vehicleService.getAllVehicles()
    //     .pipe(this.errorHandler()) as Observable<IVehicle[]>;   

    // public planets$ = this.planetService.getAllPlanets()
    //     .pipe(this.errorHandler()) as Observable<IPlanet[]>;    

    // public token$ = this.finderService.getFalconFinderApiToken()
    //     .pipe(this.errorHandler()) as Observable<string>;

    private vehiclesSubject = new Subject<IVehicle[]>();
    public vehicles$ : Observable<IVehicle[]> = this.vehiclesSubject.asObservable();

    private planetsSubject = new Subject<IPlanet[]>();
    public planets$ : Observable<IPlanet[]> = this.planetsSubject.asObservable();

    private totalTimeTakenSubject = new BehaviorSubject<number>(0);    
    public totalTimeTaken$ : Observable<number> = this.totalTimeTakenSubject.asObservable();

    private planetFoundOnSubject = new BehaviorSubject<string>('');
    public planetFoundOn$ : Observable<string> = this.planetFoundOnSubject.asObservable();
    
    private planetChangedSubject = new Subject<PlanetChange>(); 
    public planetChangedAction$ : Observable<PlanetChange> = this.planetChangedSubject.asObservable();
        
    private vehicleChangedSubject = new Subject<VehicleChange>(); 
    public vehicleChangedAction$ : Observable<VehicleChange> = this.vehicleChangedSubject.asObservable();
    
    public planetListChanges$ = this.planetChangedAction$.pipe(withLatestFrom(this.planets$))
        .pipe(
            map(([planetChange, planets]) => {
                console.log('planetChangedAction$.pipe(withLatestFrom(this.planets$)',planetChange, planets);
                const updatedPlanets = this.getPlanetListWithUpdatedAvailabilityField(planetChange, planets);                
                this.updatePlanetListForAvailability(updatedPlanets);

                const planetsLeftForSearch = this.getPlanetsAvailableForSearch(updatedPlanets);
                return new PlanetUpdates(planetsLeftForSearch, planetChange);
            })
        );

    // todo remove, just for testing
    public some$ = combineLatest([this.planets$, this.planetChangedAction$])
    .pipe(
        map(([planets, planetChange]) => {
            
            console.log('combinelatest [this.planets$, this.planetChangedAction$]',planets, planetChange);
            return new PlanetUpdates(planets, planetChange);
            
        })
    )
    
    updatePlanetListForAvailability(planets : IPlanet[]) : void {

        this.planetsSubject.next(planets);
    }
    
    getPlanetListWithUpdatedAvailabilityField(planetChange : PlanetChange, planets: IPlanet[])  : IPlanet[] {       

        if(!planetChange){
            return [...planets];
        }

        return planets.map( planet => {

            const planetCopy = {...planet};
            
            // if oldPlanet is present in the change that means we need to set includedInSearch = false
            if(planetChange.oldPlanet && planetCopy.name === planetChange.oldPlanet.name) {
                planetCopy.includedInSearch = false;
            }

            if(planetChange.newPlanet && planetCopy.name === planetChange.newPlanet.name) {
                planetCopy.includedInSearch = true;
            }

            return planetCopy;
        });
                        
    }

    getPlanetsAvailableForSearch(planets : IPlanet[]) : IPlanet[] {

        return planets.filter( currentPlanet => !currentPlanet.includedInSearch );        
    }

    vehicleListChanges$ = combineLatest([this.vehicles$, this.vehicleChangedAction$]).pipe(
        map(([vehicles, vehicleChange]) => {
           
            const updatedVehicles = this.getVehicleListWithUpdatedAvailableUnits(vehicleChange, vehicles);                            
            this.updateVehicleInfo(updatedVehicles);
            
            return new VehicleUpdates(updatedVehicles, vehicleChange);

        })
    );
    
    getVehicleListWithUpdatedAvailableUnits(vehicleChange: VehicleChange, vehicles: IVehicle[]): IVehicle[] {
        
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

    updateVehicleInfo(updatedVehicles: IVehicle[]): void {
        
        this.vehiclesSubject.next(updatedVehicles);
    }

    isReadyForSearch$ = this.searchMap$.pipe(
        map(searchMap => {
            // if searchMap contains required entries then return true		
            if(searchMap && searchMap.entries.length === this.MAX_SEARCH_ATTEMPTS_ALLOWED) {
                for(let entry of searchMap){
                    if(!entry[0] || !entry[1]) {
                        return false;
                    }
                }
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

            this.vehiclesSubject.next(vehicleList);
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

     private errorHandler() {
        return catchError(
            error => {
                this.setErrorMsg(error);
                return EMPTY;
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