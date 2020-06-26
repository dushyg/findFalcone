import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FinderFacadeService } from './services/finder-facade.service';
import { constants } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'findingFalcone';
  constructor(public finderFacadeService: FinderFacadeService) {}
  ngOnInit() {}

  public headerLinkClicked(linkName: string): void {
    if (linkName === constants.resetLink) {
      this.finderFacadeService.resetApp();
    }
  }
}
