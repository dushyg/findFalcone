import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FinderBoardComponent } from './falcon-finder/containers/finder-board/finder-board.component';
import { FalconeResultComponent } from './falcon-finder/presenters/falcone-result/falcone-result.component';
import { FinderBoardShellComponent } from './falcon-finder/containers/finder-board-shell/finder-board-shell.component';
import { FalconeResetComponent } from './falcon-finder/presenters/falcone-reset/falcone-reset.component';


const routes : Routes = [    
    {
        path : 'finderboard', 
        component : FinderBoardShellComponent,
        children : [
            {
                path : '',
                component : FinderBoardComponent
            },
            {
                path : 'result',
                component : FalconeResultComponent
            },
            {
                path : 'reset',
                component: ResetComponent
            }
        ]
    }
    
];

@NgModule({
    imports : [
        RouterModule.forChild(routes)
    ],
    exports : [RouterModule]
})
export class FalconFinderRoutingModule {}