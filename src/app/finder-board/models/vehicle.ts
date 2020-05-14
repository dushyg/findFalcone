// tslint:disable: indent
export interface IVehicle {
  name: string;
  totalNumUnits: number;
  maxDistance: number;
  speed: number;
  availNumUnits: number;
}

export interface RawVehicle {
  id?: number;
  name: string;
  total_no: number;
  max_distance: number;
  speed: number;
}
