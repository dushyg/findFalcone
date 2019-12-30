import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderBoardShellComponent } from './finder-board-shell.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinderBoardShellComponent', () => {
  let component: FinderBoardShellComponent;
  let fixture: ComponentFixture<FinderBoardShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinderBoardShellComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderBoardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});