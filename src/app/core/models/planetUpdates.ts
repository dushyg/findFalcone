import { IPlanet } from './planet';

import PlanetChange from './planetChange';

export default class PlanetUpdates {

    constructor(public planets: IPlanet[], public planetChange : PlanetChange){

    }
}