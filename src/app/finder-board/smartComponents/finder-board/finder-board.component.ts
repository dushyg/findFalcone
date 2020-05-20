import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { Router } from '@angular/router';

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
    this.finderFacadeService.setLoadingFlag(true);
    this.router.navigate(['result']);
  }
  // tslint:disable-next-line: use-lifecycle-interface
  // ngAfterViewChecked(): void {
  //   console.log('ngAfterViewChecked finder board component');
  // }
  ngOnDestroy(): void {}
}
