import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { createResponse } from '../../../inMemoryWebApiUtils';

import { PlanetsData } from './planets.data';
import { VehiclesData } from './vehicles.data';
import { TokenData } from './token.data';
import { FindFalcone } from './findFalcone.data';

export class AppData implements InMemoryDbService {
  createDb(reqInfo?: RequestInfo): {} {
    const planets = PlanetsData.planets;
    const vehicles = VehiclesData.vehicles;
    const token = TokenData.token;
    const find = FindFalcone.successResponse;
    return { planets, vehicles, token, find };
  }

  // HTTP POST interceptor, similarly GET method can be provided.
  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    if (collectionName === 'token') {
      return createResponse(reqInfo, TokenData.token);
    } else if (collectionName === 'find') {
      return createResponse(reqInfo, FindFalcone.successResponse);
    }
    return undefined; // let the default POST handle all others
  }
}
