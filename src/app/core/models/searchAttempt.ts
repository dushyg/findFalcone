import { IVehicle } from './vehicle';
import { IPlanet } from './planet';

export interface ISearchAttempt {  
    
    searchedPlanet : IPlanet;
    vehicleUsed : IVehicle;
}