import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinderBoardShellComponent } from './containers/finder-board-shell/finder-board-shell.component';
import { FinderBoardComponent } from './presenters/finder-board/finder-board.component';
import { DestinationWidgetListComponent } from './presenters/destination-widget-list/destination-widget-list.component';
import { DestinationWidgetComponent } from './presenters/destination-widget/destination-widget.component';
import { VehicleListComponent } from './presenters/vehicle-list/vehicle-list.component';
import { FalconFinderRoutingModule } from '../falcon-finder-routing.module';






@NgModule({
  declarations: [
    FinderBoardComponent,
    FinderBoardShellComponent, 
    DestinationWidgetListComponent, 
    DestinationWidgetComponent, 
    VehicleListComponent
  ],
  imports: [
    CommonModule,
    FalconFinderRoutingModule
  ]
})
export class FalconFinderModule { }
