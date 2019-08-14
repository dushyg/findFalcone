import { Component, OnInit, OnDestroy } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Observable } from 'rxjs';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';
import { takeWhile, takeUntil, subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-falcone-result',
  templateUrl: './falcone-result.component.html',
  styleUrls: ['./falcone-result.component.css']
})
export class FalconeResultComponent implements OnInit, OnDestroy {
    
  
  constructor(private finderFacadeService : FinderFacadeService) { }  
  
  public error$ : Observable<string>;
  public timeTaken$ : Observable<number>;     
  public planetNameFalconFoundOn : string = "";
  private isComponentActive: boolean = true;
  public errorMsg: string;

  ngOnInit() {

    
    this.error$ = this.finderFacadeService.error$;
    this.timeTaken$ = this.finderFacadeService.totalTimeTaken$;
    
    this.finderFacadeService.planetFoundOn$.pipe( takeWhile( () => this.isComponentActive))
            .subscribe(
              planetName => this.planetNameFalconFoundOn = planetName
            );

    this.finderFacadeService.error$.pipe( takeWhile( () => this.isComponentActive) )
              .subscribe( errorMsg => this.errorMsg = errorMsg);

  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }

}
