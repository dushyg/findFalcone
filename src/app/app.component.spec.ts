import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { createSpyObj } from './finder-board/utitlity';
import { FinderFacadeService } from './finder-board/services/finder-facade.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  @Component({
    selector: 'app-falcon-header',
    template: '',
  })
  class FakeFalconHeaderComponent { }

  @Component({
    selector: 'app-falcon-footer',
    template: '',
  })
  class FakeFalconFooterComponent { }

  let finderFacadeServiceMock;

  beforeEach(async(() => {
    finderFacadeServiceMock = {
      dashboardVm$: of({
        error: '',
        totalTimeTaken: 0,
        isReadyForSearch: false,
        isLoading: false,
        searchAttemptMap: null
      })
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        FakeFalconHeaderComponent,
        FakeFalconFooterComponent,
      ],
      providers: [{ provide: FinderFacadeService, useValue: finderFacadeServiceMock }]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'findingFalcone'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('findingFalcone');
  });

  it('should contain router outlet', fakeAsync(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(
      AppComponent
    );
    fixture.detectChanges();
    const appComponentDebugElement = fixture.debugElement;
    expect(
      appComponentDebugElement.query(By.directive(RouterOutlet))
    ).toBeTruthy();
  }));
});
