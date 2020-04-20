import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from './finder-board/services/finder-facade.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'findingFalcone';
  constructor(public finderFacadeService: FinderFacadeService) {}
  errorMessage = null;
  isComponentActive = true;
  ngOnInit() {
    this.finderFacadeService.dashboardVm$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((vm) => (this.errorMessage = vm.error));
  }
}
