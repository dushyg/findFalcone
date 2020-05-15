import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { handleError } from '../../handleError';
import { Observable } from 'rxjs';
import { constants } from 'src/app/shared/constants';
import { IFindFalconeRequest, IFindFalconeResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FalconeFinderService {
  constructor(private http: HttpClient) {}

  private readonly falconFinderApiUrl = `${constants.apiUrlBase}/find`;

  public findFalcone(
    request: IFindFalconeRequest
  ): Observable<IFindFalconeResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post<IFindFalconeResponse>(this.falconFinderApiUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          return {
            planetName: response.planet_name,
            status: response.status,
            error: response.error,
          } as IFindFalconeResponse;
        }, catchError(handleError))
      );
  }
}
