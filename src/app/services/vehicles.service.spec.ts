import { TestBed } from '@angular/core/testing';

import { TestScheduler } from 'rxjs/testing';
import { HttpClient } from '@angular/common/http';

import { of, throwError } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { IVehicle, RawVehicle } from '../models';
import { VehiclesMockData } from './mockData';
import { VehiclesService } from './index';

describe('VehiclesService', () => {
  let testScheduler: TestScheduler;

  describe('Vehicles Service success cases', () => {
    const serviceResponse: IVehicle[] = [
      {
        name: 'Space pod',
        availNumUnits: 2,
        maxDistance: 200,
        speed: 2,
        totalNumUnits: 2,
      },
      {
        name: 'Space rocket',
        availNumUnits: 1,
        maxDistance: 300,
        speed: 4,
        totalNumUnits: 1,
      },
      {
        name: 'Space shuttle',
        availNumUnits: 1,
        maxDistance: 400,
        speed: 5,
        totalNumUnits: 1,
      },
      {
        name: 'Space ship',
        availNumUnits: 2,
        maxDistance: 600,
        speed: 10,
        totalNumUnits: 2,
      },
    ];
    const mockedHttpResponse: RawVehicle[] = VehiclesMockData.vehicles;
    const httpClientMock = {
      get: jest.fn(() => {
        return of(mockedHttpResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          VehiclesService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should be created', () => {
      const service: VehiclesService = TestBed.inject(VehiclesService);
      expect(service).toBeTruthy();
    });

    it('should return mocked response when getAllVehicles is called', () => {
      const service: VehiclesService = TestBed.inject(VehiclesService);
      const apiResponse = service.getAllVehicles();
      testScheduler.run(({ expectObservable }) => {
        expectObservable(apiResponse).toBe('(a|)', {
          a: serviceResponse,
        });
      });
    });
  });

  describe('Vehicles api exception cases', () => {
    const mockedGetVehiclesResponse = {
      status: 500,
      message: 'Communication exception',
    };

    const httpClientMock = {
      get: jest.fn(() => {
        return throwError(mockedGetVehiclesResponse);
      }),
    };
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClientMock },
          VehiclesService,
        ],
      });

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return observable with error message when getAllVehicles api fails', () => {
      const service: VehiclesService = TestBed.inject(VehiclesService);
      const apiResponse = service.getAllVehicles();

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
