import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from './finder-board/services/finder-facade.service';
import { takeWhile } from 'rxjs/operators';
import { constants } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
