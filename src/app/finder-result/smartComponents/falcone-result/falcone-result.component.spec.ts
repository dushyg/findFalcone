import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FalconeResultComponent } from './falcone-result.component';
import { FinderFacadeService } from 'src/app/finder-board/services/finder-facade.service';
import { FalconeFinderService } from '../../services/falcone-finder.service';
import { of, Subject, Observable, BehaviorSubject, throwError } from 'rxjs';
import { ISearchAttempt } from 'src/app/finder-board/models/searchAttempt';
import { HttpClient } from '@angular/common/http';
import { constants } from 'src/app/shared/constants';

describe('Falcone Result Component', () => {
  let fixture: ComponentFixture<FalconeResultComponent>;
  let component: FalconeResultComponent;
  let finderFacadeServiceMock;
  let httpClientMock;
  let searchMap;

  beforeEach(() => {
    searchMap = new Map<string, ISearchAttempt>([
      [
        '1',
        {
          searchedPlanet: 'Donlon',
          vehicleUsed: 'Space pod',
        } as ISearchAttempt,
      ],
      [
        '2',
        {
          searchedPlanet: 'Enchai',
          vehicleUsed: 'Space pod',
        } as ISearchAttempt,
      ],
      [
        '3',
        {
          searchedPlanet: 'Jebing',
          vehicleUsed: 'Space rocket',
        } as ISearchAttempt,
      ],
      [
        '4',
        {
          searchedPlanet: 'Sapir',
          vehicleUsed: 'Space shuttle',
        } as ISearchAttempt,
      ],
    ]);

    finderFacadeServiceMock = {
      dashboardVm$: of({
        error: '',
        totalTimeTaken: 305,
        isReadyForSearch: true,
        isLoading: false,
        searchAttemptMap: searchMap,
      }),
      getCountOfWidgetsDisplayed: () => 4,
      getFinderApiToken: () => 'token',
      setLoadingFlag: () => {},
      updateError: () => {},
    };
  });

  describe('Falcone Result Component Success Cases', () => {
    beforeEach(() => {
      httpClientMock = {
        post: jest.fn(() => {
          return of({ planet_name: 'Jebing', status: 'success' });
        }),
      };

      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;
    });

    it('should get created', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should render correct time taken', () => {
      fixture.detectChanges();

      const divTimeTaken = fixture.nativeElement.querySelector('div.timeTaken');
      expect(divTimeTaken).toBeTruthy();
      expect(divTimeTaken.textContent).toContain('Time Taken: 305');
    });

    it('should render planet name if api call is successful', () => {
      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeTruthy();
      expect(divPlanetName.textContent).toContain('Planet Found: Jebing');
    });

    it('should render success message if api call is successful', () => {
      fixture.detectChanges();

      const divMessage = fixture.nativeElement.querySelector(
        'div.messageToBeShown'
      );
      expect(divMessage).toBeTruthy();
      expect(divMessage.textContent).toContain(constants.falconeFoundSucessMsg);
    });
  });

  describe('Falcone Result Component Failure Cases', () => {
    beforeEach(() => {
      httpClientMock = {
        post: jest.fn(() => {
          return of({ status: 'false' });
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;
    });

    it('should render failure message if falcone not found', () => {
      fixture.detectChanges();

      const divMessage = fixture.nativeElement.querySelector(
        'div.messageToBeShown'
      );
      expect(divMessage).toBeTruthy();
      expect(divMessage.textContent).toContain(constants.falconeFailureMsg);

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();
    });
  });

  describe('Falcone Result Component Api Failure Cases', () => {
    beforeEach(() => {
      const initialState = {
        error: '',
        totalTimeTaken: 305,
        isReadyForSearch: true,
        isLoading: false,
        searchAttemptMap: searchMap,
      };
      const dasboardVmSubject = new BehaviorSubject(initialState);
      finderFacadeServiceMock = {
        dashboardVm$: dasboardVmSubject.asObservable(),
        getCountOfWidgetsDisplayed: () => 4,
        getFinderApiToken: () => 'token',
        setLoadingFlag: () => {},
        updateError: (e) => {
          dasboardVmSubject.next({ ...initialState, error: e });
        },
      };
    });

    it('should render error message returned by api call', () => {
      httpClientMock = {
        post: jest.fn(() => {
          return of({
            error:
              'Token not initialized. Please get a new token with the /token API',
          });
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();

      const divErrorMsg = fixture.nativeElement.querySelector('div.errorMsg');
      expect(divErrorMsg).toBeTruthy();
      expect(divErrorMsg.textContent).toContain(
        'Token not initialized. Please get a new token with the /token API'
      );
    });

    it('should render "empty planet" error message if api returns no planet name even in a successfull call', () => {
      httpClientMock = {
        post: jest.fn(() => {
          return of({ planet_name: '', status: 'success' });
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();

      const divErrorMsg = fixture.nativeElement.querySelector('div.errorMsg');
      expect(divErrorMsg).toBeTruthy();
      expect(divErrorMsg.textContent).toContain(
        constants.falconeEmptyPlanetMsg
      );
    });

    it('should render "invalid status code" error message if api retuns non success or false status code', () => {
      httpClientMock = {
        post: jest.fn(() => {
          return of({ planet_name: '', status: 'xyz' });
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();

      const divErrorMsg = fixture.nativeElement.querySelector('div.errorMsg');
      expect(divErrorMsg).toBeTruthy();
      expect(divErrorMsg.textContent).toContain(
        constants.falconeApiInvalidResponseStatusMsg
      );
    });

    it('should render "no status field" error message if api response is missing status field', () => {
      httpClientMock = {
        post: jest.fn(() => {
          return of({ planet_name: '' });
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();

      const divErrorMsg = fixture.nativeElement.querySelector('div.errorMsg');
      expect(divErrorMsg).toBeTruthy();
      expect(divErrorMsg.textContent).toContain(
        constants.falconeApiNoResponseStatusMsg
      );
    });

    it('should render "no status field" error message if api response is a simple string', () => {
      httpClientMock = {
        post: jest.fn(() => {
          return of('some response without status code');
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();

      const divErrorMsg = fixture.nativeElement.querySelector('div.errorMsg');
      expect(divErrorMsg).toBeTruthy();
      expect(divErrorMsg.textContent).toContain(
        constants.falconeApiNoResponseStatusMsg
      );
    });

    it('should render error message if api throws exception', () => {
      httpClientMock = {
        post: jest.fn(() => {
          return throwError('Some Error thrown by api');
        }),
      };
      TestBed.configureTestingModule({
        declarations: [FalconeResultComponent],
        providers: [
          { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      fixture = TestBed.createComponent(FalconeResultComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();

      const divPlanetName = fixture.nativeElement.querySelector(
        'div.planetName'
      );
      expect(divPlanetName).toBeFalsy();

      const divErrorMsg = fixture.nativeElement.querySelector('div.errorMsg');
      expect(divErrorMsg).toBeTruthy();
      expect(divErrorMsg.textContent).toContain('Some Error thrown by api');
    });
  });
});
