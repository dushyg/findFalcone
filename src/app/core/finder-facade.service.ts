import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { IPlanet } from './models/planet';
import { Observable, BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { IVehicle } from './models/vehicle';
import { IFindFalconResponse } from './models/find-falcon-response';
import { IFindFalconRequest } from './models/find-falcon-request';
import { FalconFinderService } from './falcon-finder.service';
import { AppStateService } from './state.service';
import { ISearchAttempt } from './models/searchAttempt';
import { IVehicleSelectionParam } from './models/vehicleSelectionParam';
import { IPlanetSelectionParam } from './models/planetSelectionParam';

@Injectable({
  providedIn: 'root'
})
export class FinderFacadeService {

  constructor(private planetService : PlanetsService,
              private vehicleService : VehiclesService,
              private finderService : FalconFinderService,
              private appStateService : AppStateService) { }

  // private findFalconSubject = new Subject<IFindFalconRequest>();
  // private planetSelectedSubject = new Subject<IPlanetSelectionParam>();
  // private vehicleSelectedSubject = new Subject<IVehicleSelectionParam>();      
  
  // private findFalcon$ = this.findFalconSubject.asObservable();
  // private planetSelected$ = this.planetSelectedSubject.asObservable();
  // private vehicleSelected$ = this.vehicleSelectedSubject.asObservable();
  
  // public raiseFalconSearchEvent

  private countPlanetsToBeSearched = new BehaviorSubject<number>(this.appStateService.maxSearchAttempt);  
  public countPlanetsToBeSearched$ = this.countPlanetsToBeSearched.asObservable();
  private setSearchCount(count : number) {
    this.countPlanetsToBeSearched.next(count);
  }

  private error = new BehaviorSubject<string>("");
  public error$ = this.error.asObservable();
  public setError(errorMsg : string) {
    this.error.next(errorMsg);
  }            

  private planetList = new BehaviorSubject<IPlanet[]>([]);
  public planetList$ = this.planetList.asObservable();
  private setPlanets(planets : IPlanet[]) {

    this.planetList.next(planets);
  }

  
  private vehicleList = new BehaviorSubject<IVehicle[]>([]);
  public vehicleList$ = this.vehicleList.asObservable();
  private setVehicles(vehicles : IVehicle[]) {

    this.vehicleList.next(vehicles);
  }

  private searchAttempts = new BehaviorSubject<Map<string, ISearchAttempt>>(this.appStateService.getSearchMap());
  public searchAttempts$ = this.searchAttempts.asObservable();
  public setSearchAttempt(widgetId : string , searchAttempt : ISearchAttempt) {

    this.appStateService.setSearchAttempt(widgetId, searchAttempt);
  }

  private timeTaken = new BehaviorSubject<number>(0);
  public timeTaken$ = this.timeTaken.asObservable();
  public setTimeTaken(timeTaken : number) {
    this.timeTaken.next(timeTaken);
  }

  private finderResponse = new BehaviorSubject<IFindFalconResponse>(<IFindFalconResponse>{ error : '', planetName : '', status : ''});
  public finderResponse$ = this.finderResponse.asObservable();
  private setFalconResponse(falconResponse : IFindFalconResponse) {
    this.finderResponse.next(falconResponse);    
  }  

  private finderApiToken : string;

  private findFalcon(request : IFindFalconRequest) {

     request.token = this.finderApiToken; 
     this.finderService.findFalcon(request)
        .subscribe( (response: IFindFalconResponse) => {
            this.setFalconResponse(response);
        },
        (error) => {
          this.setErrorHandler(error);
        }
        );
  }


  public initializeAppData() {

    forkJoin(
      this.vehicleService.getAllVehicles(),
      this.planetService.getAllPlanets(),
      this.finderService.getFalconFinderApiToken()
    )
    .subscribe( response => {

        // this.setSearchCount(this.appStateService.maxSearchAttempt);
        
        this.appStateService.setVehicleList(response[0]);
        this.setVehicles(this.appStateService.getVehicleList());
        
        this.appStateService.setPlanetList(response[1]);
        this.setPlanets(this.appStateService.getUnsearchedPlanetList());
        
        this.finderApiToken = response[2].token;
    },
      (error) => {
        this.setErrorHandler(error);
      }
    );
  }

  private setErrorHandler(error : any){
    console.log('set Errr handler', error);
    this.setError(error);
  }


}
