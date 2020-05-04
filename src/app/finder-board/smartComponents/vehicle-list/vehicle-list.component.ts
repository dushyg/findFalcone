import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { IVehicle } from 'src/app/finder-board/models/vehicle';
import VehicleChange from 'src/app/finder-board/models/vehicleChange';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { takeWhile, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListComponent implements OnInit, OnDestroy {
  private isComponentActive = true;

  constructor(
    private finderFacadeService: FinderFacadeService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public vehicleList: IVehicle[];

  @Input() public destinationDistance: number;
  @Input() public widgetId: number;

  public lastSelectedVehicle: IVehicle = {
    availNumUnits: 0,
    name: null,
  } as IVehicle;

  ngOnInit() {
    let vehicleListInitialized = false;

    this.finderFacadeService.vehicleInventory$
      .pipe(takeWhile(() => !vehicleListInitialized))
      .subscribe((initialVehicles: IVehicle[]) => {
        if (initialVehicles) {
          this.vehicleList = initialVehicles;
          vehicleListInitialized = true;
          this.changeDetector.detectChanges();
        }
      });

    this.finderFacadeService.vehicleChangedAction$
      .pipe(
        withLatestFrom(this.finderFacadeService.vehicleInventory$),
        takeWhile(() => this.isComponentActive)
      )
      .subscribe(([vehicleChange, updatedVehicles]) => {
        if (vehicleChange && vehicleChange.widgetId <= this.widgetId) {
          this.vehicleList = updatedVehicles;
          this.changeDetector.detectChanges();
        }
      });

    this.finderFacadeService.planetChangedAction$
      .pipe(
        withLatestFrom(this.finderFacadeService.vehicleInventory$),
        takeWhile(() => this.isComponentActive)
      )
      .subscribe(([planetChange, updatedVehicles]) => {
        // need to refresh the vehicle list even when the planet is chnaged for current widget
        if (planetChange && planetChange.widgetId <= this.widgetId) {
          this.vehicleList = updatedVehicles;
          if (planetChange.widgetId !== this.widgetId) {
            this.clearLastSelection();
            this.changeDetector.detectChanges();
          }
        }
      });
  }

  public vehicleSelected(vehicle: IVehicle) {
    this.lastSelectedVehicle = vehicle;

    this.finderFacadeService.vehicleChanged(
      new VehicleChange(this.widgetId, vehicle.name)
    );
  }

  clearLastSelection(): void {
    this.lastSelectedVehicle = { availNumUnits: 0, name: null } as IVehicle;
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked(): void {
    // console.log('VehicleListComponent ngAfterViewChecked', this.widgetId);
  }
}
