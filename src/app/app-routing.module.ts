import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { FinderBoardComponent } from "./finder-board/smartComponents/finder-board/finder-board.component";
import { FalconeResetComponent } from "./shared/presenterComponents/falcone-reset/falcone-reset.component";

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
    loadChildren: () =>
      import("./finder-result/finderResult.module").then(
        (m) => m.FinderResultModule
      ),
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
