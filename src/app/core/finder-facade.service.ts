import { Injectable } from '@angular/core';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { Planet } from './models/planet';
import { Observable, BehaviorSubject } from 'rxjs';
import { Vehicle } from './models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class FinderFacadeService {

  constructor(private planetService : PlanetsService,
              private vehicleService : VehiclesService) { }

  
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
            this.setErrorHandler 
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
            this.setErrorHandler 
          );    
  }

  private setErrorHandler(error : string){
    console.log('set Errr handler');
    this.setError(error);
  }
}
