import { NgModule } from "@angular/core";
import { FalconFooterComponent } from "./presenterComponents/falcon-footer/falcon-footer.component";
import { FalconeResetComponent } from "./presenterComponents/falcone-reset/falcone-reset.component";
import { FalconHeaderComponent } from "./smartComponents/falcon-header/falcon-header.component";

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
