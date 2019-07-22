import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  public getFalconFinderApiToken() : Observable<string>{

    return this.http.post<string>(this.tokenApiUrl, {})
              .pipe(catchError(handleError));
  }

  private readonly falconFinderApiUrl = 'https://findfalcone.herokuapp.com/find';

  public findFalcon(request : IFindFalconRequest) : Observable<IFindFalconResponse> {
    return this.http.post<IFindFalconResponse>(this.falconFinderApiUrl, request)
              .pipe(
                map( (response: any) => {
                  return <IFindFalconResponse>{
                    planetName : response.planet_name,
                    status,
                    error : response.error
                  };
                },
                catchError(handleError))
              );
  }
}
