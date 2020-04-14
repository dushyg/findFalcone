import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  OnDestroy,
} from "@angular/core";

import { IPlanet } from "src/app/core/models/planet";
import { IVehicleSelectionParam } from "src/app/core/models/vehicleSelectionParam";
import { IVehicle } from "src/app/core/models/vehicle";
import { IPlanetSelectionParam } from "src/app/core/models/planetSelectionParam";
import PlanetChange from "src/app/core/models/planetChange";
import VehicleChange from "src/app/core/models/vehicleChange";
import { Observable, Subject } from "rxjs";
import PlanetUpdates from "src/app/core/models/planetUpdates";
import VehicleUpdates from "src/app/core/models/vehicleUpdates";
import { ISearchAttempt } from "src/app/core/models/searchAttempt";
import { FinderFacadeService } from "src/app/core/finder-facade.service";
import { takeWhile, withLatestFrom, take } from "rxjs/operators";

@Component({
  selector: "app-destination-widget",
  templateUrl: "./destination-widget.component.html",
  styleUrls: ["./destination-widget.component.scss"],
})
export class DestinationWidgetComponent implements OnInit, OnDestroy {
  private static createdWidgetCount: number = 0;
  public widgetId: number;

  public planetList: IPlanet[];

  public destinationDistance: number = 0;

  public lastSelectedPlanet: string = "Select";

  private resetTypeAheadSubject = new Subject<void>();
  public resetTypeAhead$: Observable<
    void
  > = this.resetTypeAheadSubject.asObservable();

  private isComponentActive = true;

  constructor(private finderFacadeService: FinderFacadeService) {
    // using modulo operator to cycle the widget ids from 1 to max widget count
    this.widgetId =
      (DestinationWidgetComponent.createdWidgetCount %
        this.finderFacadeService.getCountOfWidgetsDisplayed()) +
      1;
    DestinationWidgetComponent.createdWidgetCount++;
  }

  ngOnInit(): void {
    //this.clearLastSelection();
    //let planetListInitialized = false;
    this.finderFacadeService.unsearchedPlanets$
      //.pipe(takeWhile(() => !planetListInitialized))
      .subscribe((unsearchedPlanets: IPlanet[]) => {
        if (unsearchedPlanets) {
          this.planetList = unsearchedPlanets;
          //planetListInitialized = true;
        }
      });

    this.finderFacadeService.planetChangedAction$
      .pipe(
        withLatestFrom(this.finderFacadeService.unsearchedPlanets$),
        takeWhile(() => this.isComponentActive)
      )
      .subscribe(([planetChange, unsearchedPlanets]) => {
        if (planetChange && planetChange.widgetId < this.widgetId) {
          this.planetList = unsearchedPlanets;
          this.clearLastSelection();
        }
      });

    this.finderFacadeService.vehicleChangedAction$
      .pipe(
        withLatestFrom(this.finderFacadeService.unsearchedPlanets$),
        takeWhile(() => this.isComponentActive)
      )
      .subscribe(([vehicleChange, unsearchedPlanets]) => {
        if (vehicleChange && vehicleChange.widgetId < this.widgetId) {
          this.planetList = unsearchedPlanets;
          this.clearLastSelection();
        }
      });
  }

  clearLastSelection(): void {
    this.lastSelectedPlanet = "Select";
    this.resetTypeAheadSubject.next();
  }

  public planetSelected(selectedPlanet: IPlanet) {
    this.destinationDistance = selectedPlanet.distance;

    this.lastSelectedPlanet = selectedPlanet.name;

    this.finderFacadeService.planetChanged(
      new PlanetChange(this.widgetId, selectedPlanet.name)
    );
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
