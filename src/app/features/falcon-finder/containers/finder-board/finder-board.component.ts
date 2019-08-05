import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { Observable } from 'rxjs';
import { IPlanet } from 'src/app/core/models/planet';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';
import { IFindFalconRequest } from 'src/app/core/models/find-falcon-request';
import { IPlanetSelectionParam } from 'src/app/core/models/planetSelectionParam';
import { IVehicleSelectionParam } from 'src/app/core/models/vehicleSelectionParam';
import { Router } from '@angular/router';
import { takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-finder-board',
  templateUrl: './finder-board.component.html',
  styleUrls: ['./finder-board.component.css']
})
export class FinderBoardComponent implements OnInit {
  
  constructor(private finderFacadeService : FinderFacadeService,
              private router : Router) {
    console.log('finder facade service constructed',finderFacadeService);
   }
  
  public countPlanetsToBeSearched$ : Observable<number>; 
  public error$ : Observable<string>;
  public planetList$ : Observable<IPlanet[]>;
  public vehicleList$ : Observable<IVehicle[]>;
  public timeTaken$ : Observable<number>;
  public findResponse$ : Observable<IFindFalconResponse>;
  

  ngOnInit() {

    this.countPlanetsToBeSearched$ = this.finderFacadeService.countPlanetsToBeSearched$;
    this.error$ = this.finderFacadeService.error$;
    this.planetList$ = this.finderFacadeService.planetList$;
    this.vehicleList$ = this.finderFacadeService.vehicleList$;
    this.timeTaken$ = this.finderFacadeService.timeTaken$;
    this.findResponse$ = this.finderFacadeService.finderResponse$;

    
    //this.finderFacadeService.loadAllPlanets();
    //this.finderFacadeService.loadAllVehicles();
    this.finderFacadeService.initializeAppData();

  }

  planetSelected(planetSelectionParam : IPlanetSelectionParam) {
    console.log('finder board - planet selected', planetSelectionParam);
  }

  vehicleSelected(vehicleSelectionParam : IVehicleSelectionParam){
    console.log('finder board - vehicle selected', vehicleSelectionParam);
  }

  public findFalcone(){

    // todo check if a valid request can be constructed
    // if it cant be done show error
    // else fire off a request to find falcone and navigate to result page
      const request : IFindFalconRequest = <IFindFalconRequest>{
        planet_names : ['Donlon','Enchai','Pingasor','Sapir'],
        vehicle_names : ['Space pod','Space pod','Space ship','Space shuttle']        
      };
      this.finderFacadeService.findFalcon(request);
      this.router.navigate(['result']);
  }
}
