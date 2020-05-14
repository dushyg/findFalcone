// tslint:disable: max-line-length
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FinderBoardComponent } from './finder-board/smartComponents/finder-board/finder-board.component';
import { DestinationWidgetListComponent } from './finder-board/presenterComponents/destination-widget-list/destination-widget-list.component';
import { DestinationWidgetComponent } from './finder-board/smartComponents/destination-widget/destination-widget.component';
import { VehicleListComponent } from './finder-board/smartComponents/vehicle-list/vehicle-list.component';
import { TypeaheadComponent } from './finder-board/presenterComponents/typeahead/typeahead.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppData } from './finder-board/services/mockData/app.data';
import { environment } from 'src/environments/environment';
import { constants } from './shared/constants';

@NgModule({
  declarations: [
    AppComponent,
    FinderBoardComponent,
    DestinationWidgetListComponent,
    DestinationWidgetComponent,
    VehicleListComponent,
    TypeaheadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    environment.production
      ? []
      : HttpClientInMemoryWebApiModule.forRoot(AppData, {
          delay: 100,
          host: constants.apiDomain,
          apiBase: '/',
          rootPath: '/',
          passThruUnknownUrl: true,
        }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
