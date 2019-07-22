import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Planet } from 'src/app/core/models/planet';
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/core/models/vehicle';

@Component({
  selector: 'app-finder-board-shell',
  templateUrl: './finder-board-shell.component.html',
  styleUrls: ['./finder-board-shell.component.css']
})
export class FinderBoardShellComponent implements OnInit {

  constructor(private finderFacadeService : FinderFacadeService) {
    console.log('finder facade service constructed',finderFacadeService);
   }
  public error$ : Observable<string>;
  public planets$ : Observable<Planet[]>;
  public vehicles$ : Observable<Vehicle[]>;
  
  ngOnInit() {

    this.error$ = this.finderFacadeService.error$;
    this.planets$ = this.finderFacadeService.planetList$;
    this.vehicles$ = this.finderFacadeService.vehicleList$;

    //this.finderFacadeService.loadAllPlanets();
    //this.finderFacadeService.loadAllVehicles();
    this.finderFacadeService.initializeAppData();
  }

}
