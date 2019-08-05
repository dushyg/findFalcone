import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FalconFinderModule } from './features/falcon-finder/falcon-finder.module';

const routes: Routes = [
  {
    path : '', redirectTo : 'finderboard', pathMatch : 'full'    
  },
  {
    path : '**', redirectTo : 'finderboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {enableTracing : true}),
    FalconFinderModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
