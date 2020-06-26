import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { FalconeResetComponent } from './shared/presenterComponents';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
  },
  {
    path: 'finderboard',
    loadChildren: () =>
      import('./finder-board/finder-board.module').then(
        (m) => m.FinderBoardModule
      ),
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
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
