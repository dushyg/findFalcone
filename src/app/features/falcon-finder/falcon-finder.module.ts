import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinderBoardShellComponent } from './containers/finder-board-shell/finder-board-shell.component';
import { FinderBoardComponent } from './containers/finder-board/finder-board.component';
import { DestinationWidgetListComponent } from './presenters/destination-widget-list/destination-widget-list.component';
import { DestinationWidgetComponent } from './presenters/destination-widget/destination-widget.component';
import { VehicleListComponent } from './presenters/vehicle-list/vehicle-list.component';
import { FalconFinderRoutingModule } from '../falcon-finder-routing.module';
import { FalconHeaderComponent } from './presenters/falcon-header/falcon-header.component';
import { FalconFooterComponent } from './presenters/falcon-footer/falcon-footer.component';
import { FalconeResultComponent } from './presenters/falcone-result/falcone-result.component';
import { FalconeResetComponent } from './presenters/falcone-reset/falcone-reset.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [
    FinderBoardComponent,
    FinderBoardShellComponent, 
    DestinationWidgetListComponent, 
    DestinationWidgetComponent, 
    VehicleListComponent,
    FalconHeaderComponent, 
    FalconFooterComponent, 
    FalconeResultComponent,
    FalconeResetComponent
  ],
  imports: [
    CommonModule,
    FalconFinderRoutingModule,
    FormsModule,
    ReactiveFormsModule    
  ]
})
export class FalconFinderModule { }
