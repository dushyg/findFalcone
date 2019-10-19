import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { FalconFinderService } from './falcon-finder.service';
import { Router } from '@angular/router';
import { IFindFalconRequest } from './models/find-falcon-request';
import { IFindFalconResponse } from './models/find-falcon-response';
import { catchError, map } from 'rxjs/operators';
import { Subject, EMPTY, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import PlanetChange from './models/planetChange';
import VehicleChange from './models/vehicleChange';
import PlanetUpdates from './models/planetUpdates';
import { IPlanet } from './models/planet';

@Injectable({providedIn : 'root'})
export class Facade {

    constructor(private planetService : PlanetsService,
                private vehicleService : VehiclesService,
                private finderService : FalconFinderService,
                private router : Router){
        
    }

    private finderApiToken : string;   

    private searchMapSubject = new Subject<Map<string, string>>();
    public searchMap$ : Observable<Map<string, string>> = this.searchMapSubject.asObservable();

    private maxSearchAttemptAllowedSubject = new BehaviorSubject<number>(4);    
    public maxSearchAttemptAllowed$ : Observable<number> = this.maxSearchAttemptAllowedSubject.asObservable();

    private errorMessageSubject = new Subject<string>();
    public errorMessage$ : Observable<string> = this.errorMessageSubject.asObservable();

    public vehicles$ = this.vehicleService.getAllVehicles()
        .pipe(this.errorHandler());

    public planets$ = this.planetService.getAllPlanets()
        .pipe(this.errorHandler());

    public token$ = this.finderService.getFalconFinderApiToken()
        .pipe(this.errorHandler());

    private totalTimeTakenSubject = new BehaviorSubject<number>(0);    
    public totalTimeTaken$ : Observable<number> = this.totalTimeTakenSubject.asObservable();

    private planetFoundOnSubject = new BehaviorSubject<string>('');
    public planetFoundOn$ : Observable<string> = this.planetFoundOnSubject.asObservable();
    
    private planetChangedSubject = new Subject<PlanetChange>(); 
    public planetChangedAction$ : Observable<PlanetChange> = this.planetChangedSubject.asObservable();
        
    private vehicleChangedSubject = new Subject<VehicleChange>(); 
    public vehicleChangedAction$ : Observable<VehicleChange> = this.vehicleChangedSubject.asObservable();
    
    
    // combineLatest or merge
    public planetListChanges$ = combineLatest([this.planets$, this.planetChangedAction$])
    .pipe(
        map(([planets, planetChange]) => {
            // if planet is being set for first time, update the planet list by removing currently set planet
            // if planet is being updated, add back earlier planet and remove new planet
            // return modified planet array along with planetChange
            let planetUpdates : PlanetUpdates;
            let updatedPlanets : IPlanet[];

        })
    )

    vehicleListChanges$ = combineLatest([vehicles$, vehicleChangedAction$]).pipe(
        map([vehicles, vehicleChanged] => {
            // if vehicle is being set for the first time, decrement avail qty
            // if vehicle is being updated, increment previously decremented vehicle qty, decrement current vehicle qty
            // return updated vehile array
        })
    )    

    isReadyForSearch$ = this.searchMap$.pipe(
        map(searchMap => {
            // if searchMap contains required entries then return true		
        })
    )

    public initializeApp(){

        this.finderService.getFalconFinderApiToken()
            .subscribe( resp => {
                if(resp && resp.token){
                    this.finderApiToken = resp.token;
                }                
                else {
                    this.setErrorMsg('Invalid or empty token passed by falcone api.');
                }
            },
            error => {
                this.setErrorMsg(error);
            })
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
                     this.appStateService.updatePlanetFoundOn(response.planetName);
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

     resetApp(){
        this.router.navigate(['/finderboard/reset']);
      }
}