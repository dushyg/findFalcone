import { Component, OnInit } from "@angular/core";
import { FinderFacadeService } from "src/app/finder-board/services/finder-facade.service";

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
