import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { handleError } from "./handleError";
import { Observable } from "rxjs";
import { IFindFalconeRequest } from "./models/findFalconeRequest";
import { IFindFalconeResponse } from "./models/findFalconeResponse";

@Injectable({
  providedIn: "root",
})
export class FalconFinderService {
  constructor(private http: HttpClient) {}

  private readonly falconFinderApiUrl =
    "https://findfalcone.herokuapp.com/find";

  public findFalcon(
    request: IFindFalconeRequest
  ): Observable<IFindFalconeResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post<IFindFalconeResponse>(this.falconFinderApiUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          return <IFindFalconeResponse>{
            planetName: response.planet_name,
            status: response.status,
            error: response.error,
          };
        }, catchError(handleError))
      );
  }
}
