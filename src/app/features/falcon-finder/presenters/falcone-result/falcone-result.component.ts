import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Observable } from 'rxjs';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-falcone-result',
  templateUrl: './falcone-result.component.html',
  styleUrls: ['./falcone-result.component.css']
})
export class FalconeResultComponent implements OnInit {

  constructor(private finderFacadeService : FinderFacadeService) { }
  public findResponse$ : Observable<IFindFalconResponse>;
  public error$ : Observable<string>;
  public timeTaken$ : Observable<number>;   
  private isComponentActive: boolean = true;
  
  public planetNameFalconFoundOn : string;
  ngOnInit() {

    this.findResponse$ = this.finderFacadeService.finderResponse$;
    this.error$ = this.finderFacadeService.error$;
    this.timeTaken$ = this.finderFacadeService.timeTaken$;
    this.findResponse$.pipe( takeWhile( () => this.isComponentActive))
    .subscribe( r => {

      if(r.error) {
        this.finderFacadeService.setError(r.error);
      }
      else {
        this.planetNameFalconFoundOn = r.planetName;
      }
      
    });

  }

}
