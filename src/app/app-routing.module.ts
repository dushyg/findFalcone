import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FinderBoardComponent } from "./features/falcon-finder/containers/finder-board/finder-board.component";
import { FalconeResultComponent } from "./features/falcon-finder/presenters/falcone-result/falcone-result.component";
import { FalconeResetComponent } from "./features/falcon-finder/presenters/falcone-reset/falcone-reset.component";
import { DestinationWidgetListComponent } from "./features/falcon-finder/presenters/destination-widget-list/destination-widget-list.component";
import { DestinationWidgetComponent } from "./features/falcon-finder/presenters/destination-widget/destination-widget.component";
import { VehicleListComponent } from "./features/falcon-finder/presenters/vehicle-list/vehicle-list.component";
import { FalconHeaderComponent } from "./features/falcon-finder/presenters/falcon-header/falcon-header.component";
import { FalconFooterComponent } from "./features/falcon-finder/presenters/falcon-footer/falcon-footer.component";
import { Typeahead } from "./features/falcon-finder/presenters/typeahead/typeahead.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    redirectTo: "finderboard",
    pathMatch: "full",
  },
  {
    path: "finderboard",
    component: FinderBoardComponent,
  },
  {
    path: "result",
    component: FalconeResultComponent,
  },
  {
    path: "reset",
    component: FalconeResetComponent,
  },
  {
    path: "**",
    redirectTo: "finderboard",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
