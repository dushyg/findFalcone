import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../handleError";

@Injectable({
  providedIn: "root",
})
export class FalconeTokenService {
  constructor(private http: HttpClient) {}

  private readonly tokenApiUrl = "https://findfalcone.herokuapp.com/token";

  public getFalconeFinderApiToken(): Observable<{ token: string }> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
      }),
    };
    return this.http
      .post<{ token: string }>(this.tokenApiUrl, null, httpOptions)
      .pipe(catchError(handleError));
  }
}
