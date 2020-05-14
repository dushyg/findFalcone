import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVehicle, RawVehicle } from '../models/vehicle';
import { map, catchError, tap } from 'rxjs/operators';
import { handleError } from '../../handleError';
import { constants } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  constructor(private http: HttpClient) {}

  readonly vehicleApiUrl = `${constants.apiUrlBase}/vehicles`;

  public getAllVehicles(): Observable<IVehicle[]> {
    return this.http.get<RawVehicle[]>(this.vehicleApiUrl).pipe(
      map((vehicles: RawVehicle[]) => {
        return vehicles.map((v: RawVehicle) => {
          return {
            name: v.name,
            availNumUnits: v.total_no,
            maxDistance: v.max_distance,
            speed: v.speed,
            totalNumUnits: v.total_no,
          } as IVehicle;
        });
      }),
      catchError(handleError)
    );
  }
}
