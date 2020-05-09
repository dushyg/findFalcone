import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';

import { FinderFacadeService } from './finder-board/services/finder-facade.service';
import { FalconHeaderComponent } from './shared/presenterComponents/falcon-header/falcon-header.component';
import { FalconFooterComponent } from './shared/presenterComponents/falcon-footer/falcon-footer.component';
import { PlanetsService } from './finder-board/services/planets.service';
import { VehiclesService } from './finder-board/services/vehicles.service';
import { FalconeTokenService } from './finder-board/services/falcone-token.service';
import { SharedModule } from './shared/shared.module';
import { createSpyObj } from './finder-board/utitlity';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let planetServiceMock: jest.Mock<any, any>;
  let vehiclesServiceMock: jest.Mock<any, any>;
  let apiTokenServiceMock: jest.Mock<any, any>;
  let routerServiceMock: { [key: string]: jest.Mock<any, any> };

  beforeEach(() => {
    planetServiceMock = jest.fn();
    vehiclesServiceMock = jest.fn();
    apiTokenServiceMock = jest.fn();
    routerServiceMock = createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FalconHeaderComponent,
        FalconFooterComponent,
      ],
      providers: [
        FinderFacadeService,
        { provide: PlanetsService, useValue: planetServiceMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: FalconeTokenService, useValue: apiTokenServiceMock },
        { provide: Router, useValue: routerServiceMock },
      ],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    (expect(fixture) as any).toMatchSnapshot();
  });

  it(`should have as title 'findingFalcone'`, () => {
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('findingFalcone');
  });

  it('should contain header component', () => {
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.directive(FalconHeaderComponent))
    ).toBeTruthy();
  });

  it('should contain footer component', () => {
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.directive(FalconFooterComponent))
    ).toBeTruthy();
  });

  it('should contain router outlet', () => {
    fixture.detectChanges();
    const appComponentDebugElement = fixture.debugElement;
    expect(
      appComponentDebugElement.query(By.directive(RouterOutlet))
    ).toBeTruthy();
  });

  it('should call finderFacadeService.resetApp when rest link is clicked in the header', () => {
    fixture.detectChanges();
    const spy = jest.spyOn(component.finderFacadeService, 'resetApp');

    const findLink: HTMLLinkElement = fixture.nativeElement.querySelector(
      'nav.headerContainer div.resetSection a.resetLink'
    );
    expect(findLink).toBeTruthy();

    findLink.click();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
