import { ISearchAttempt } from "./searchAttempt";
import { IPlanet } from "./planet";
import { IVehicle } from "./vehicle";

export interface IFalconAppState {
  searchMap: Map<string, ISearchAttempt>;
  planetList: IPlanet[];
  vehicleList: IVehicle[];
  unsearchedPlanets: IPlanet[];
  vehicleInventory: IVehicle[];
  totalTimeTaken: number;
  errorMsg: string;
  isLoading: boolean;
  isReadyToSearch: boolean;
}
