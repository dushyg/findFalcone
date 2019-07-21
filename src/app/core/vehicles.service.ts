import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from './models/vehicle';
import { map, catchError } from 'rxjs/operators';
import { handleError } from './handleError';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  constructor(private http : HttpClient) { }

  readonly vehicleApiUrl = 'https://findfalcone.herokuapp.com/vehicles';

  public getAllVehicles() : Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.vehicleApiUrl)
                    .pipe(
                      map( (vehicles : any[], index) => {

                           vehicles[index] = <Vehicle>{ 
                            name : vehicles[index].name,
                            maxDistance : vehicles[index].max_distance,
                            totalNumUnits : vehicles[index].total_no,
                            availNumUnits : vehicles[index].total_no,
                            speed : vehicles[index].speed
                          };

                          return vehicles;
                      }),
                      catchError(handleError)
                    );

  }
}
