import { Component, OnInit, OnDestroy } from "@angular/core";

import { IPlanet } from "src/app/finder-board/models/planet";
import PlanetChange from "src/app/finder-board/models/planetChange";
import { Observable, Subject, combineLatest } from "rxjs";
import { FinderFacadeService } from "src/app/finder-board/services/finder-facade.service";
import { takeWhile, withLatestFrom } from "rxjs/operators";

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
  public planetListInitialized = false;
  constructor(private finderFacadeService: FinderFacadeService) {
    // using modulo operator to cycle the widget ids from 1 to max widget count
    this.widgetId =
      (DestinationWidgetComponent.createdWidgetCount %
        this.finderFacadeService.getCountOfWidgetsDisplayed()) +
      1;
    DestinationWidgetComponent.createdWidgetCount++;
  }

  ngOnInit(): void {
    combineLatest(
      this.finderFacadeService.unsearchedPlanets$,
      this.finderFacadeService.isLoading$
    )
      .pipe(takeWhile(() => !this.planetListInitialized))
      .subscribe(([unsearchedPlanets, isLoading]) => {
        if (unsearchedPlanets && !isLoading) {
          this.planetList = unsearchedPlanets;
          this.planetListInitialized = true;
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
