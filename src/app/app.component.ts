import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FinderFacadeService } from './finder-board/services/finder-facade.service';
import { constants } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'findingFalcone';
  constructor(public finderFacadeService: FinderFacadeService) {}
  ngOnInit() {}

  public headerLinkClicked(linkName: string): void {
    if (linkName === constants.resetLink) {
      this.finderFacadeService.resetApp();
    }
  }

  ngAfterViewChecked(): void {
    console.log('AppComponent ngAfterViewChecked');
  }
}
