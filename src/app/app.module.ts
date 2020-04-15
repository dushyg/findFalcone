import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { FinderBoardComponent } from "./features/falcon-finder/smartComponents/finder-board/finder-board.component";
import { DestinationWidgetListComponent } from "./features/falcon-finder/smartComponents/destination-widget-list/destination-widget-list.component";
import { DestinationWidgetComponent } from "./features/falcon-finder/smartComponents/destination-widget/destination-widget.component";
import { VehicleListComponent } from "./features/falcon-finder/smartComponents/vehicle-list/vehicle-list.component";
import { FalconHeaderComponent } from "./features/falcon-finder/smartComponents/falcon-header/falcon-header.component";
import { FalconFooterComponent } from "./features/falcon-finder/presenterComponents/falcon-footer/falcon-footer.component";
import { FalconeResultComponent } from "./features/falcon-finder/smartComponents/falcone-result/falcone-result.component";
import { FalconeResetComponent } from "./features/falcon-finder/presenterComponents/falcone-reset/falcone-reset.component";
import { Typeahead } from "./features/falcon-finder/presenterComponents/typeahead/typeahead.component";
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
