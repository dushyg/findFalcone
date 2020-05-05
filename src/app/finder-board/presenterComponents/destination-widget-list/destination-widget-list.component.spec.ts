import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationWidgetListComponent } from './destination-widget-list.component';

xdescribe('DestinationWidgetListComponent', () => {
  let component: DestinationWidgetListComponent;
  let fixture: ComponentFixture<DestinationWidgetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationWidgetListComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationWidgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
