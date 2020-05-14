import { TestBed } from '@angular/core/testing';

import { FalconeFinderService } from './falcone-finder.service';
import { TestScheduler } from 'rxjs/testing';
import { HttpClient } from '@angular/common/http';
import { IFindFalconeResponse } from '../models/findFalconeResponse';
import { IFindFalconeRequest } from '../models/findFalconeRequest';
import { of, throwError } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { FindFalconeMockData } from 'src/app/finder-board/services/mockData/findFalcone.data';

describe('FalconeFinderService', () => {
  let testScheduler: TestScheduler;

  describe('FalconeFinder success cases', () => {
    const mockedHttpResponse = FindFalconeMockData.successResponse;
    const mockedFindFalconeResponse: IFindFalconeResponse = {
      error: '',
      planetName: 'Donlon',
      status: 'success',
    };

    const httpClientMock = {
      post: jest.fn(() => {
        return of(mockedHttpResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should be created', () => {
      const service: FalconeFinderService = TestBed.get(FalconeFinderService);
      expect(service).toBeTruthy();
    });

    it('should return mocked response when findFalcone is called', () => {
      const service: FalconeFinderService = TestBed.get(FalconeFinderService);
      const apiResponse = service.findFalcone({} as IFindFalconeRequest);
      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedFindFalconeResponse,
        });
      });
    });
  });

  describe('Falcone Finder failure to find cases', () => {
    const mockedHttpResponse = FindFalconeMockData.failureResponse;
    const mockedFindFalconeResponse: IFindFalconeResponse = {
      error: undefined,
      planetName: undefined,
      status: 'false',
    };

    const httpClientMock = {
      post: jest.fn(() => {
        return of(mockedHttpResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return response with status of false when falcone is not found', () => {
      const service: FalconeFinderService = TestBed.get(FalconeFinderService);
      const apiResponse = service.findFalcone({} as IFindFalconeRequest);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedFindFalconeResponse,
        });
      });
    });
  });

  describe('Falcone Finder api error cases', () => {
    const mockedHttpResponse = FindFalconeMockData.errorResponse;
    const mockedFindFalconeResponse: IFindFalconeResponse = {
      error:
        'Token not initialized. Please get a new token with the /token API',
      planetName: undefined,
      status: undefined,
    };

    const httpClientMock = {
      post: jest.fn(() => {
        return of(mockedHttpResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return response with error message when findFalcone api fails', () => {
      const service: FalconeFinderService = TestBed.get(FalconeFinderService);
      const apiResponse = service.findFalcone({} as IFindFalconeRequest);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedFindFalconeResponse,
        });
      });
    });
  });

  describe('Falcone Finder api exception cases', () => {
    const mockedFindFalconeResponse = FindFalconeMockData.exceptionResponse;

    const httpClientMock = {
      post: jest.fn(() => {
        return throwError(mockedFindFalconeResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          FalconeFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return observable with error message when findFalcone api fails', () => {
      const service: FalconeFinderService = TestBed.get(FalconeFinderService);
      const apiResponse = service.findFalcone({} as IFindFalconeRequest);

      testScheduler.run(({ expectObservable }: RunHelpers) => {
        expectObservable(apiResponse).toBe(
          '#',
          null,
          mockedFindFalconeResponse
        );
      });
    });
  });
});
