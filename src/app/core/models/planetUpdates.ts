import { IPlanet } from './planet';

import PlanetChange from './planetChange';
import { IVehicle } from './vehicle';

export default class PlanetUpdates {

    constructor(public planets: IPlanet[], public planetChange : PlanetChange, public vehicles : IVehicle[]){

    }
}