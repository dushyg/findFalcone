import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { createResponse } from '../../inMemoryWebApiUtils';
import {
  PlanetsMockData,
  VehiclesMockData,
  TokenMockData,
  FindFalconeMockData,
} from '.';

export class AppData implements InMemoryDbService {
  createDb(reqInfo?: RequestInfo): {} {
    const planets = PlanetsMockData.planets;
    const vehicles = VehiclesMockData.vehicles;
    const token = TokenMockData.token;
    const find = FindFalconeMockData.successResponse;
    return { planets, vehicles, token, find };
  }

  // HTTP POST interceptor, similarly GET method can be provided.
  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    if (collectionName === 'token') {
      return createResponse(reqInfo, TokenMockData.token);
    } else if (collectionName === 'find') {
      return createResponse(reqInfo, FindFalconeMockData.successResponse);
    }
    return undefined; // let the default POST handle all others
  }
}
