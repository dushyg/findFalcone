import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinderBoardComponent } from './finder-board/smartComponents';
import { FalconeResetComponent } from './shared/presenterComponents';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
  },
  {
    path: 'finderboard',
    component: FinderBoardComponent,
  },
  {
    path: 'result',
    loadChildren: () =>
      import('./finder-result/finderResult.module').then(
        (m) => m.FinderResultModule
      ),
  },
  {
    path: 'reset',
    component: FalconeResetComponent,
  },
  {
    path: '**',
    redirectTo: 'finderboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
