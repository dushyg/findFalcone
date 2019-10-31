import { Component, OnInit, OnDestroy } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Observable, combineLatest } from 'rxjs';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';
import { takeWhile, takeUntil, subscribeOn } from 'rxjs/operators';
import FalconeFacade from 'src/app/core/facade.service';
import { IFindFalconRequest } from 'src/app/core/models/find-falcon-request';

@Component({
  selector: 'app-falcone-result',
  templateUrl: './falcone-result.component.html',
  styleUrls: ['./falcone-result.component.css']
})
export class FalconeResultComponent implements OnInit, OnDestroy {
    
  
  constructor(private finderFacadeService : FalconeFacade) { }  
  
  public error$ : Observable<string>;
  public timeTaken$ : Observable<number>;     
  public planetNameFalconFoundOn : string = "";
  private isComponentActive: boolean = true;
  public errorMsg: string;
  public timeTaken : number = 0;  
  private maxSearchAttemptsAllowedCount : number;

  ngOnInit() {

        
    this.timeTaken$ = this.finderFacadeService.totalTimeTaken$;
    this.maxSearchAttemptsAllowedCount = this.finderFacadeService.getMaxSearchAttemptsAllowedCount();

    this.finderFacadeService.planetFoundOn$.pipe( takeWhile( () => this.isComponentActive))
            .subscribe(
              planetName => this.planetNameFalconFoundOn = planetName
            );

    this.finderFacadeService.errorMessage$.pipe( takeWhile( () => this.isComponentActive) )
              .subscribe( errorMsg => this.errorMsg = errorMsg);

    this.finderFacadeService.totalTimeTaken$.pipe( takeWhile( () => this.isComponentActive) )
    .subscribe( timeTaken => this.timeTaken = timeTaken);    

    combineLatest(this.finderFacadeService.searchMap$, this.finderFacadeService.isReadyForSearch$)
          .subscribe( searchState => {
            let findFalconRequest : IFindFalconRequest ; 
              const searchAttemptMap = searchState[0];
              const isReadyToSearch = searchState[1];

              if(isReadyToSearch && searchAttemptMap) {
                  
                const request = <IFindFalconRequest> {
                    planet_names : new Array<string>(this.maxSearchAttemptsAllowedCount),
                    vehicle_names : new Array<string>(this.maxSearchAttemptsAllowedCount)
                  };
                
                let index = 0;
                for(let searchAttemptEntry of searchAttemptMap) {
                  
                  const searchAttempt = searchAttemptEntry[1];

                  request.planet_names[index] = searchAttempt.searchedPlanet.name;
                  request.vehicle_names[index] = searchAttempt.vehicleUsed.name;
                  
                  index++;
                }  

                findFalconRequest = request;                
              }
              else {
                findFalconRequest = null;
              }

              if(findFalconRequest) {
                this.finderFacadeService.findFalcon(findFalconRequest);
              }
          }); 
  }

  reset() {
    this.finderFacadeService.resetApp();
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }

}
