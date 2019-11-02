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
  

  ngOnInit() {

        
    this.timeTaken$ = this.finderFacadeService.totalTimeTaken$;    

    this.finderFacadeService.planetFoundOn$.pipe( takeWhile( () => this.isComponentActive))
            .subscribe(
              planetName => this.planetNameFalconFoundOn = planetName
            );

    this.finderFacadeService.errorMessage$.pipe( takeWhile( () => this.isComponentActive) )
              .subscribe( errorMsg => this.errorMsg = errorMsg);

    this.finderFacadeService.totalTimeTaken$.pipe( takeWhile( () => this.isComponentActive) )
    .subscribe( timeTaken => this.timeTaken = timeTaken);       
  }

  reset() {
    this.finderFacadeService.resetApp();
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }

}
