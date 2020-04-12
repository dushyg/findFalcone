import { Component, OnInit, OnDestroy } from "@angular/core";
import { FinderFacadeService } from "src/app/core/finder-facade.service";
import { Observable } from "rxjs";
import { IPlanet } from "src/app/core/models/planet";
import { IVehicle } from "src/app/core/models/vehicle";
import { Router } from "@angular/router";
import { takeWhile } from "rxjs/operators";
import PlanetChange from "src/app/core/models/planetChange";
import VehicleChange from "src/app/core/models/vehicleChange";

@Component({
  selector: "app-finder-board",
  templateUrl: "./finder-board.component.html",
  styleUrls: ["./finder-board.component.scss"],
})
export class FinderBoardComponent implements OnInit, OnDestroy {
  constructor(
    public finderFacadeService: FinderFacadeService,
    private router: Router
  ) {}

  public isLoading: boolean;
  public error: string;
  public timeTaken: number;
  public isReadyToSearch: boolean;
  public countPlanetsToBeSearched: number;

  private isComponentActive = true;

  ngOnInit() {
    this.finderFacadeService.dashboardVm$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((vm) => {
        this.error = vm.error;
        this.timeTaken = vm.totalTimeTaken;
        this.isReadyToSearch = vm.isReadyForSearch;
        this.countPlanetsToBeSearched = vm.maxCountPlanetsToBeSearched;
        this.isLoading = vm.isLoading;
      });

    this.finderFacadeService.initializeAppData();
  }

  public findFalcone() {
    this.router.navigate(["result"]);
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
