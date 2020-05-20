import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinderFacadeService } from 'src/app/finder-board/services';

@Component({
  template: '',
})
export class FalconeResetComponent implements OnInit {
  constructor(
    private router: Router,
    private finderFacadeService: FinderFacadeService
  ) {}

  ngOnInit() {
    this.finderFacadeService.setLoadingFlag(true);
    this.router.navigate(['/finderboard']);
  }
}
