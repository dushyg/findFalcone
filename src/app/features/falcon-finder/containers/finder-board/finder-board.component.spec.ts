import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderBoardComponent } from './finder-board.component';

xdescribe('FinderBoardComponent', () => {
  let component: FinderBoardComponent;
  let fixture: ComponentFixture<FinderBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinderBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
