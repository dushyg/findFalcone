import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { handleError } from './handleError';
import { Observable } from 'rxjs';
import { IFindFalconRequest } from './models/find-falcon-request';
import { IFindFalconResponse } from './models/find-falcon-response';

@Injectable({
  providedIn: 'root'
})
export class FalconFinderService {

  constructor(private http : HttpClient) { }

  private readonly tokenApiUrl = 'https://findfalcone.herokuapp.com/token';

  public getFalconFinderApiToken() : Observable<{token: string}>{

    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json'
      })
    };
    return this.http.post<{token: string}>(this.tokenApiUrl, null, httpOptions)
              .pipe(catchError(handleError));
  }

  private readonly falconFinderApiUrl = 'https://findfalcone.herokuapp.com/find';

  public findFalcon(request : IFindFalconRequest) : Observable<IFindFalconResponse> {

    const httpOptions = {
      headers : new HttpHeaders({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      })
    };
    return this.http.post<IFindFalconResponse>(this.falconFinderApiUrl, request, httpOptions)
              .pipe(
                map( (response: any) => {
                  return <IFindFalconResponse>{
                    planetName : response.planet_name,
                    status : response.status,
                    error : response.error
                  };
                },
                catchError(handleError))
              );
  }
}
