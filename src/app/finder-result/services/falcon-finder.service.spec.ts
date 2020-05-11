import { TestBed } from '@angular/core/testing';

import { FalconFinderService } from './falcon-finder.service';
import { TestScheduler } from 'rxjs/testing';
import { HttpClient } from '@angular/common/http';
import { IFindFalconeResponse } from '../models/findFalconeResponse';
import { IFindFalconeRequest } from '../models/findFalconeRequest';
import { of, throwError } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';

describe('FalconFinderService', () => {
  let testScheduler: TestScheduler;

  describe('FalconFinder success cases', () => {
    const mockedHttpResponse = {
      error: '',
      planet_name: 'Donlon',
      status: 'success',
    };
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
          FalconFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should be created', () => {
      const service: FalconFinderService = TestBed.get(FalconFinderService);
      expect(service).toBeTruthy();
    });

    it('should return mocked response when findFalcone is called', () => {
      const service: FalconFinderService = TestBed.get(FalconFinderService);
      const apiResponse = service.findFalcon({} as IFindFalconeRequest);
      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedFindFalconeResponse,
        });
      });
    });
  });

  describe('Falcon Finder failure to find cases', () => {
    const mockedHttpResponse = {
      status: 'false',
    };
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
          FalconFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return response with status of false when falcone is not found', () => {
      const service: FalconFinderService = TestBed.get(FalconFinderService);
      const apiResponse = service.findFalcon({} as IFindFalconeRequest);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedFindFalconeResponse,
        });
      });
    });
  });

  describe('Falcon Finder api error cases', () => {
    const mockedHttpResponse = {
      error:
        'Token not initialized. Please get a new token with the /token API',
    };
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
          FalconFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return response with error message when findFalcone api fails', () => {
      const service: FalconFinderService = TestBed.get(FalconFinderService);
      const apiResponse = service.findFalcon({} as IFindFalconeRequest);

      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedFindFalconeResponse,
        });
      });
    });
  });

  describe('Falcon Finder api exception cases', () => {
    // const mockedFindFalconeResponse: IFindFalconeResponse = {
    //   error:
    //     'Communication exception',
    //   planetName: undefined,
    //   status: undefined,
    // };

    const mockedFindFalconeResponse = 'Communication exception';

    const httpClientMock = {
      post: jest.fn(() => {
        return throwError(mockedFindFalconeResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          FalconFinderService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return observable with error message when findFalcone api fails', () => {
      const service: FalconFinderService = TestBed.get(FalconFinderService);
      const apiResponse = service.findFalcon({} as IFindFalconeRequest);

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
