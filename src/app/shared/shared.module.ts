import { NgModule } from '@angular/core';
import {
  FalconFooterComponent,
  FalconeResetComponent,
  FalconHeaderComponent,
  SpinnerComponent,
} from './presenterComponents';

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
})
export class SharedModule {}
