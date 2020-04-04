import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { FinderBoardComponent } from "./features/falcon-finder/containers/finder-board/finder-board.component";
import { DestinationWidgetListComponent } from "./features/falcon-finder/presenters/destination-widget-list/destination-widget-list.component";
import { DestinationWidgetComponent } from "./features/falcon-finder/presenters/destination-widget/destination-widget.component";
import { VehicleListComponent } from "./features/falcon-finder/presenters/vehicle-list/vehicle-list.component";
import { FalconHeaderComponent } from "./features/falcon-finder/presenters/falcon-header/falcon-header.component";
import { FalconFooterComponent } from "./features/falcon-finder/presenters/falcon-footer/falcon-footer.component";
import { FalconeResultComponent } from "./features/falcon-finder/presenters/falcone-result/falcone-result.component";
import { FalconeResetComponent } from "./features/falcon-finder/presenters/falcone-reset/falcone-reset.component";
import { Typeahead } from "./features/falcon-finder/presenters/typeahead/typeahead.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    FinderBoardComponent,
    DestinationWidgetListComponent,
    DestinationWidgetComponent,
    VehicleListComponent,
    FalconHeaderComponent,
    FalconFooterComponent,
    FalconeResultComponent,
    FalconeResetComponent,
    Typeahead,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
