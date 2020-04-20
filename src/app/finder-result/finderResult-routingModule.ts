import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FalconeResultComponent } from './smartComponents/falcone-result/falcone-result.component';

const routes: Routes = [
  {
    path: '',
    component: FalconeResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinderResultRoutingModule {}
