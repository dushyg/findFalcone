import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IVehicle } from "src/app/core/models/vehicle";
import { IPlanet } from "src/app/core/models/planet";
import { IVehicleSelectionParam } from "src/app/core/models/vehicleSelectionParam";
import { IPlanetSelectionParam } from "src/app/core/models/planetSelectionParam";
import { Observable } from "rxjs";
import PlanetUpdates from "src/app/core/models/planetUpdates";
import VehicleUpdates from "src/app/core/models/vehicleUpdates";
import { FinderFacadeService } from "src/app/core/finder-facade.service";

@Component({
  selector: "app-destination-widget-list",
  templateUrl: "./destination-widget-list.component.html",
  styleUrls: ["./destination-widget-list.component.scss"],
})
export class DestinationWidgetListComponent implements OnInit {
  constructor(private finderFacadeService: FinderFacadeService) {}

  public widgetCountIterator: number[];

  ngOnInit() {
    this.widgetCountIterator = new Array<number>(
      this.finderFacadeService.getCountOfWidgetsDisplayed()
    ).fill(0);
  }
}
