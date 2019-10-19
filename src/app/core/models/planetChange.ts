import { IPlanet } from './planet';

export default class PlanetChange {
    
    constructor(
        public widgetId : number, 
        public oldPlanet : IPlanet, 
        public newPlanet : IPlanet )
    {

    } 
}