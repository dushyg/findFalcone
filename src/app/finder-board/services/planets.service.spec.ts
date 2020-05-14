import { TestBed } from '@angular/core/testing';

import { TestScheduler } from 'rxjs/testing';
import { HttpClient } from '@angular/common/http';

import { of, throwError } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { PlanetsService } from './planets.service';
import { IPlanet } from '../models/planet';
import { PlanetsMockData } from './mockData/planets.data';

describe('PlanetsService', () => {
  let testScheduler: TestScheduler;

  describe('Planets Service success cases', () => {
    const mockedHttpResponse: IPlanet[] = PlanetsMockData.planets;

    const httpClientMock = {
      get: jest.fn(() => {
        return of(mockedHttpResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          PlanetsService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should be created', () => {
      const service: PlanetsService = TestBed.get(PlanetsService);
      expect(service).toBeTruthy();
    });

    it('should return mocked response when getAllPlanets is called', () => {
      const service: PlanetsService = TestBed.get(PlanetsService);
      const apiResponse = service.getAllPlanets();
      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: mockedHttpResponse,
        });
      });
    });
  });

  describe('Planets api exception cases', () => {
    const mockedGetPlanetsResponse = {
      status: 500,
      message: 'Communication exception',
    };

    const httpClientMock = {
      get: jest.fn(() => {
        return throwError(mockedGetPlanetsResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          PlanetsService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return observable with error message when getAllPlanets api fails', () => {
      const service: PlanetsService = TestBed.get(PlanetsService);
      const apiResponse = service.getAllPlanets();

      testScheduler.run(({ expectObservable }: RunHelpers) => {
        expectObservable(apiResponse).toBe(
          '#',
          null,
          'Backend returned status 500 - Error Message : Communication exception'
        );
      });
    });
  });
});
