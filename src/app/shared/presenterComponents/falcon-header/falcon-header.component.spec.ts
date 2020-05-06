import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FalconHeaderComponent } from './falcon-header.component';

describe('FalconHeaderComponent', () => {
  let component: FalconHeaderComponent;
  let fixture: ComponentFixture<FalconHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FalconHeaderComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FalconHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
