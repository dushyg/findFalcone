import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { IVehicle } from "src/app/core/models/vehicle";
import VehicleChange from "src/app/core/models/vehicleChange";
import { FinderFacadeService } from "src/app/core/finder-facade.service";
import { takeWhile, withLatestFrom } from "rxjs/operators";

@Component({
  selector: "app-vehicle-list",
  templateUrl: "./vehicle-list.component.html",
  styleUrls: ["./vehicle-list.component.scss"],
})
export class VehicleListComponent implements OnInit, OnDestroy {
  private isComponentActive: boolean = true;

  constructor(private finderFacadeService: FinderFacadeService) {}

  public vehicleList: IVehicle[];

  @Input() public destinationDistance: number;
  @Input() public widgetId: number;

  public lastSelectedVehicle: IVehicle = <IVehicle>{
    availNumUnits: 0,
    name: null,
  };

  ngOnInit() {
    //this.clearLastSelection();

    //let vehicleListInitialized = false;

    this.finderFacadeService.vehicleInventory$
      //.pipe(takeWhile(() => !vehicleListInitialized))
      .subscribe((initialVehicles: IVehicle[]) => {
        if (initialVehicles) {
          this.vehicleList = initialVehicles;
          //  vehicleListInitialized = true;
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
          }
        }
      });

    /*
    this.finderFacadeService.availableVehicleListUpdated$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((widgetIdToVehicleListMap) => {
        if (!widgetIdToVehicleListMap) {
          return;
        }
        const updatedVehicleList: IVehicle[] = widgetIdToVehicleListMap.get(
          this.widgetId.toString()
        );
        if (updatedVehicleList !== this.vehicleList) {
          this.vehicleList = updatedVehicleList;
        }
      });

    this.finderFacadeService.lastUpdatedWidgetId$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((lastUpdatedWidgetId) => {
        if (lastUpdatedWidgetId === null || lastUpdatedWidgetId === undefined) {
          return;
        }
        if (this.widgetId > lastUpdatedWidgetId) {
          this.clearLastSelection();
        }
      });*/
  }

  public vehicleSelected(vehicle: IVehicle) {
    // console.log('vehicle select - ', vehicle);

    this.finderFacadeService.vehicleChanged(
      new VehicleChange(this.widgetId, vehicle.name)
    );

    this.lastSelectedVehicle = vehicle;
  }

  clearLastSelection(): void {
    this.lastSelectedVehicle = <IVehicle>{ availNumUnits: 0, name: null };
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
