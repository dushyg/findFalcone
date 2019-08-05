import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPlanet } from './models/planet';
import { handleError } from './handleError';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlanetsService {

  constructor(private http : HttpClient) { }

  readonly planetsApiUrl = 'https://findfalcone.herokuapp.com/planets';

  public getAllPlanets() : Observable<IPlanet[]>{

    return this.http.get<IPlanet[]>(this.planetsApiUrl)    
                    .pipe(                        
                      catchError(handleError)
                    );
  }
}
