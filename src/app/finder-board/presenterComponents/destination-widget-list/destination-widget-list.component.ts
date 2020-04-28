import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-destination-widget-list',
  templateUrl: './destination-widget-list.component.html',
  styleUrls: ['./destination-widget-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationWidgetListComponent implements OnInit {
  constructor() {}

  @Input() private maxWidgetCount;
  public widgetCountIterator: number[];

  ngOnInit() {
    this.widgetCountIterator = new Array<number>(this.maxWidgetCount).fill(0);
  }
}
