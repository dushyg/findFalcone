import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPlanet } from '../models/planet';
import { handleError } from '../../handleError';
import { catchError, map } from 'rxjs/operators';
import { constants } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class PlanetsService {
  constructor(private http: HttpClient) {}

  readonly planetsApiUrl = `${constants.apiUrlBase}/planets`;

  public getAllPlanets(): Observable<IPlanet[]> {
    return this.http.get<IPlanet[]>(this.planetsApiUrl).pipe(
      map((planets) => {
        return planets.map((planet) => {
          return planet;
        });
      }),
      catchError(handleError)
    );
  }
}
