import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { constants } from '../../constants';

@Component({
  selector: 'app-falcon-header',
  templateUrl: './falcon-header.component.html',
  styleUrls: ['./falcon-header.component.scss'],
})
export class FalconHeaderComponent implements OnInit {
  constructor() {}
  @Output() private headerLinkClicked = new EventEmitter<string>();
  ngOnInit() {}

  reset() {
    this.headerLinkClicked.emit(constants.resetLink);
  }
}
