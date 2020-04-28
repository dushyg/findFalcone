import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-finder-board',
  templateUrl: './finder-board.component.html',
  styleUrls: ['./finder-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinderBoardComponent implements OnInit, OnDestroy {
  constructor(
    public finderFacadeService: FinderFacadeService,
    private router: Router
  ) {}

  public maxWidgetCount = 0;
  ngOnInit() {
    this.finderFacadeService.initializeAppData();
    this.maxWidgetCount = this.finderFacadeService.getCountOfWidgetsDisplayed();
  }

  public findFalcone() {
    this.router.navigate(['result']);
  }

  ngOnDestroy(): void {}
}
