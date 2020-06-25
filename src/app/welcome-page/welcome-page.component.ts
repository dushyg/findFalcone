import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FinderFacadeService } from '../services';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  constructor(
    private router: Router,
    private finderFacadeService: FinderFacadeService
  ) {}

  public start() {
    this.finderFacadeService.setLoadingFlag(true);
    this.router.navigate(['/finderboard']);
  }
}
