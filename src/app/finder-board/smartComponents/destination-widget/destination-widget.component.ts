import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Observable, Subject, combineLatest } from 'rxjs';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { takeWhile, withLatestFrom } from 'rxjs/operators';
import { IPlanet, PlanetChange } from '../../models';

@Component({
  selector: 'app-destination-widget',
  templateUrl: './destination-widget.component.html',
  styleUrls: ['./destination-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationWidgetComponent implements OnInit, OnDestroy {
  private static createdWidgetCount = 0;
  public widgetId: number;

  public planetList: IPlanet[];

  public destinationDistance = 0;

  public lastSelectedPlanet = 'Select';

  private resetTypeAheadSubject = new Subject<void>();
  public resetTypeAhead$: Observable<
    void
  > = this.resetTypeAheadSubject.asObservable();

  private isComponentActive = true;
  public planetListInitialized = false;
  constructor(
    private finderFacadeService: FinderFacadeService,
    private changeDetector: ChangeDetectorRef
  ) {
    // using modulo operator to cycle the widget ids from 1 to max widget count
    this.widgetId =
      (DestinationWidgetComponent.createdWidgetCount %
        this.finderFacadeService.getCountOfWidgetsDisplayed()) +
      1;
    DestinationWidgetComponent.createdWidgetCount++;
  }

  ngOnInit(): void {
    combineLatest([
      this.finderFacadeService.unsearchedPlanets$,
      this.finderFacadeService.isLoading$,
    ])
      .pipe(takeWhile(() => !this.planetListInitialized))
      .subscribe(([unsearchedPlanets, isLoading]) => {
        if (unsearchedPlanets && !isLoading) {
          this.planetList = unsearchedPlanets;
          this.planetListInitialized = true;
          this.changeDetector.detectChanges();
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
          this.changeDetector.detectChanges();
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
          this.changeDetector.detectChanges();
        }
      });
  }

  clearLastSelection(): void {
    this.lastSelectedPlanet = 'Select';
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
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked(): void {
    // console.log('DestinationWidgetComponent ngAfterViewChecked', this.widgetId);
  }
}
