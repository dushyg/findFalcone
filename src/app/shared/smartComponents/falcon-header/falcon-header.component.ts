import { Component, OnInit } from '@angular/core';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';

@Component({
  selector: 'app-falcon-header',
  templateUrl: './falcon-header.component.html',
  styleUrls: ['./falcon-header.component.scss'],
})
export class FalconHeaderComponent implements OnInit {
  constructor(private finderFacadeService: FinderFacadeService) {}

  ngOnInit() {}

  reset() {
    this.finderFacadeService.resetApp();
  }
}
