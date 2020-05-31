import { NgModule } from '@angular/core';
import {
  FalconFooterComponent,
  FalconeResetComponent,
  FalconHeaderComponent,
  SpinnerComponent} from './presenterComponents';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FalconFooterComponent,
    FalconeResetComponent,
    FalconHeaderComponent,
    SpinnerComponent,
  ],
  exports: [
    FalconFooterComponent,
    FalconeResetComponent,
    FalconHeaderComponent,
    SpinnerComponent,
  ],
  imports: [CommonModule]
})
export class SharedModule {}
