import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FalconeResultComponent } from './smartComponents/falcone-result/falcone-result.component';
import { CommonModule } from '@angular/common';
import { FinderResultRoutingModule } from './finderResult-routingModule';

@NgModule({
  declarations: [FalconeResultComponent],
  imports: [SharedModule, CommonModule, FinderResultRoutingModule],
})
export class FinderResultModule {}
