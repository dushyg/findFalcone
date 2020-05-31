import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { constants } from '../../constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-falcon-header',
  templateUrl: './falcon-header.component.html',
  styleUrls: ['./falcon-header.component.scss'],
})
export class FalconHeaderComponent implements OnInit {
  public env: { production: boolean; };
  constructor() {}
  @Output() private headerLinkClicked = new EventEmitter<string>();
  ngOnInit() {
    this.env = environment;
  }

  reset() {
    this.headerLinkClicked.emit(constants.resetLink);
  }
}
