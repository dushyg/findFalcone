import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FinderBoardComponent } from "./features/falcon-finder/smartComponents/finder-board/finder-board.component";
import { FalconeResultComponent } from "./features/falcon-finder/smartComponents/falcone-result/falcone-result.component";
import { FalconeResetComponent } from "./features/falcon-finder/presenterComponents/falcone-reset/falcone-reset.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "finderboard",
    pathMatch: "full",
  },
  {
    path: "finderboard",
    component: FinderBoardComponent,
  },
  {
    path: "result",
    component: FalconeResultComponent,
  },
  {
    path: "reset",
    component: FalconeResetComponent,
  },
  {
    path: "**",
    redirectTo: "finderboard",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
