import { IPlanet } from './planet';

export default class PlanetChange {
  constructor(public widgetId: number, public newPlanetName: string) {}
}
