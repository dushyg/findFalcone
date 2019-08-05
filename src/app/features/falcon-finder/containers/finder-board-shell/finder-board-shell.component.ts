import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from 'src/app/core/finder-facade.service';
import { IPlanet } from 'src/app/core/models/planet';
import { Observable } from 'rxjs';
import { IVehicle } from 'src/app/core/models/vehicle';
import { IFindFalconRequest } from 'src/app/core/models/find-falcon-request';
import { IFindFalconResponse } from 'src/app/core/models/find-falcon-response';

@Component({
  selector: 'app-finder-board-shell',
  templateUrl: './finder-board-shell.component.html',
  styleUrls: ['./finder-board-shell.component.css']
})
export class FinderBoardShellComponent {

}
