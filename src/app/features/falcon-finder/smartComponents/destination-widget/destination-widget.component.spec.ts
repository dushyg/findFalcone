import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationWidgetComponent } from './destination-widget.component';

xdescribe('DestinationWidgetComponent', () => {
  let component: DestinationWidgetComponent;
  let fixture: ComponentFixture<DestinationWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
