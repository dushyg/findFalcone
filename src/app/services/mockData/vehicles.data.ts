import { RawVehicle } from '../../models/vehicle';

export class VehiclesMockData {
  public static vehicles: RawVehicle[] = [
    {
      name: 'Space pod',
      id: 1,
      max_distance: 200,
      speed: 2,
      total_no: 2,
    },
    {
      name: 'Space rocket',
      id: 2,
      max_distance: 300,
      speed: 4,
      total_no: 1,
    },
    {
      name: 'Space shuttle',
      id: 3,
      max_distance: 400,
      speed: 5,
      total_no: 1,
    },
    {
      name: 'Space ship',
      id: 4,
      max_distance: 600,
      speed: 10,
      total_no: 2,
    },
  ];
}
