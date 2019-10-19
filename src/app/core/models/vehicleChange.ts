import { IVehicle } from './vehicle';

export default class VehicleChange {
    
    constructor(
        public widgetId : number,
        public oldVehicle : IVehicle, 
        public newVehicle : IVehicle )
    {
        
    } 
}