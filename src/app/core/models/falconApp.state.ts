import { ISearchAttempt } from './searchAttempt';
import { IPlanet } from './planet';
import { IVehicle } from './vehicle';

export interface IFalconAppState {

    searchMap : Map<string, ISearchAttempt>;
    availablePlanetListMap : Map<string, IPlanet[]>;
    availableVehicleListMap : Map<string, IVehicle[]>;
    planetList : IPlanet[];
    vehicleList : IVehicle[];
    maxSearchAttemptAllowed : number;
    totalTimeTaken : number;
    errorMsg: string;
    isLoading : boolean;
    planetFoundOn: string;
    isReadyToSearch : boolean;
    lastUpdatedWidgetId : number;    
}