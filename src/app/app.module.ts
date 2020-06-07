// tslint:disable: max-line-length
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from 'src/environments/environment';
import { constants } from './shared/constants';
import {
  FinderBoardComponent,
  DestinationWidgetComponent,
  VehicleListComponent,
} from './finder-board/smartComponents';
import {
  DestinationWidgetListComponent,
  TypeaheadComponent,
} from './finder-board/presenterComponents';
import { AppData } from './finder-board/services/mockData/app.data';

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
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
