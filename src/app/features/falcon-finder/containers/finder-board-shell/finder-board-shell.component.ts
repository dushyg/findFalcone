import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Planet } from 'src/app/core/models/planet';
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/core/models/vehicle';
import { IFindFalconRequest } from 'src/app/core/models/find-falcon-request';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';

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
  public findResponse$ : Observable<IFindFalconResponse>;

  ngOnInit() {

    this.error$ = this.finderFacadeService.error$;
    this.planets$ = this.finderFacadeService.planetList$;
    this.vehicles$ = this.finderFacadeService.vehicleList$;
    this.findResponse$ = this.finderFacadeService.finderResponse$;

    //this.finderFacadeService.loadAllPlanets();
    //this.finderFacadeService.loadAllVehicles();
    this.finderFacadeService.initializeAppData();
  }

  public findFalcon(request : IFindFalconRequest){

      request = <IFindFalconRequest>{
        planet_names : ['Donlon','Enchai','Pingasor','Sapir'],
        vehicle_names : ['Space pod','Space pod','Space ship','Space shuttle']        
      };
      this.finderFacadeService.findFalcon(request);
  }
}
