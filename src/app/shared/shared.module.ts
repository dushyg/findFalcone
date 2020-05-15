import { NgModule } from '@angular/core';
import {
  FalconFooterComponent,
  FalconeResetComponent,
  FalconHeaderComponent,
} from './presenterComponents';

@NgModule({
  declarations: [
    FalconFooterComponent,
    FalconeResetComponent,
    FalconHeaderComponent,
  ],
  exports: [
    FalconFooterComponent,
    FalconeResetComponent,
    FalconHeaderComponent,
  ],
})
export class SharedModule {}
