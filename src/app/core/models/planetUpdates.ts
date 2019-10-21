import { IPlanet } from './planet';

import PlanetChange from './planetChange';
import VehicleChange from './vehicleChange';

export default class PlanetUpdates {

    constructor(public planets: IPlanet[], public planetChange : PlanetChange, public vehicleChange : VehicleChange){

    }
}