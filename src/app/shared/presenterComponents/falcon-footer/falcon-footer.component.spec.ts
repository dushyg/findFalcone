import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FalconFooterComponent } from './falcon-footer.component';

describe('FalconFooterComponent', () => {
  let component: FalconFooterComponent;
  let fixture: ComponentFixture<FalconFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FalconFooterComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FalconFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
