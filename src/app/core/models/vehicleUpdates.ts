import { IVehicle } from './vehicle';
import VehicleChange from './vehicleChange';

export default class VehicleUpdates{

    constructor(public vehicles: IVehicle[], public vehicleChange : VehicleChange){

    }
}