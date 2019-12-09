import { ISearchAttempt } from './searchAttempt';
import { IPlanet } from './planet';
import { IVehicle } from './vehicle';

export interface IFalconAppState {

    searchMap : Map<string, ISearchAttempt>;
    planetList : IPlanet[];
    vehicleList : IVehicle[];
    maxSearchAttemptAllowed : number;
    totalTimeTaken : number;
    errorMsg: string;
    isLoading : boolean;
    planetFoundOn: string;
    isReadyToSearch : boolean;
    lastUpdatedWidgetId : number;
    availablePlanetsSet: Set<string>;
}