import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinderBoardShellComponent } from './falcon-finder/containers/finder-board-shell/finder-board-shell.component';

const routes : Routes = [    
    {
        path : 'finderboard', component : FinderBoardShellComponent
    }
];

@NgModule({
    imports : [
        RouterModule.forChild(routes)
    ],
    exports : [RouterModule]
})
export class FalconFinderRoutingModule {}