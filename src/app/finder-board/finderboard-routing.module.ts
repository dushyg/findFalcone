import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinderBoardComponent } from './smartComponents';

const routes: Routes = [
  {
    path: '',
    component: FinderBoardComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinderBoardRoutingModule {}
