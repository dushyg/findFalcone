import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { Planet } from './models/planet';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { Vehicle } from './models/vehicle';
import { IFindFalconResponse } from './models/find-falcon-response';
import { IFindFalconRequest } from './models/find-falcon-request';
import { FalconFinderService } from './falcon-finder.service';

@Injectable({
  providedIn: 'root'
})
export class FinderFacadeService {

  constructor(private planetService : PlanetsService,
              private vehicleService : VehiclesService,
              private finderService : FalconFinderService) { }

  
  private error = new BehaviorSubject<string>("");
  public error$ = this.error.asObservable();
  public setError(errorMsg : string) {
    this.error.next(errorMsg);
  }            

  private planetList = new BehaviorSubject<Planet[]>([]);
  public planetList$ = this.planetList.asObservable();
  private setPlanets(planets : Planet[]) {

    this.planetList.next(planets);
  }

  public loadAllPlanets(){
    console.log('load all planets in facade');
     this.planetService.getAllPlanets()
          .subscribe( planets => {
             this.setPlanets(planets);
          },
          (error) => {
            this.setErrorHandler(error);
          } 
          );    
  }
  
  private vehicleList = new BehaviorSubject<Vehicle[]>([]);
  public vehicleList$ = this.vehicleList.asObservable();
  private setVehicles(vehicles : Vehicle[]) {

    this.vehicleList.next(vehicles);
  }

  public loadAllVehicles() {
    console.log('load all vehicles in facade');
     this.vehicleService.getAllVehicles()
          .subscribe( vehicles => {
             this.setVehicles(vehicles);
          },
          (error) => {
            this.setErrorHandler(error);
          } 
          );    
  }   

  private finderResponse = new BehaviorSubject<IFindFalconResponse>(<IFindFalconResponse>{ error : '', planetName : '', status : ''});
  public finderResponse$ = this.finderResponse.asObservable();
  private setFalconResponse(falconResponse : IFindFalconResponse) {
    this.finderResponse.next(falconResponse);
  }

  private finderApiToken : string;

  public findFalcon(request : IFindFalconRequest) {
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
        this.setVehicles(response[0]);
        this.setPlanets(response[1]);
        this.finderApiToken = response[2];
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
