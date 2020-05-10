import { FalconeTokenService } from './falcone-token.service';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
describe('falconeTokenService', () => {
  let testScheduler: TestScheduler;
  const tokenToBeReturned = { token: 'dummyApiToken' };
  beforeEach(() => {
    const httpClientMock = {
      post: jest.fn(() => {
        return of(tokenToBeReturned);
      }),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
        FalconeTokenService,
      ],
    });

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should get created', () => {
    const falconeTokenService: FalconeTokenService = TestBed.get(
      FalconeTokenService
    );
    expect(falconeTokenService).toBeTruthy();
  });

  it('should return a non empty token when getFalconeFinderApiToken is called', () => {
    const falconeTokenService: FalconeTokenService = TestBed.get(
      FalconeTokenService
    );
    const response$ = falconeTokenService.getFalconeFinderApiToken();
    testScheduler.run((helpers) => {
      helpers
        .expectObservable(response$)
        .toBe('(a|)', { a: tokenToBeReturned });
    });
  });
});
