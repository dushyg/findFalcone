import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  FinderBoardComponent,
  DestinationWidgetComponent,
  VehicleListComponent,
} from './smartComponents';
import {
  DestinationWidgetListComponent,
  TypeaheadComponent,
} from './presenterComponents';
import { RouterModule } from '@angular/router';
import { FinderBoardRoutingModule } from './finderboard-routing.module';

@NgModule({
  declarations: [
    FinderBoardComponent,
    DestinationWidgetListComponent,
    DestinationWidgetComponent,
    VehicleListComponent,
    TypeaheadComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FinderBoardRoutingModule,
  ],
})
export class FinderBoardModule {}
