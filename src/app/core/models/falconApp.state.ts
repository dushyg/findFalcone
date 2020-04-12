import { ISearchAttempt } from "./searchAttempt";
import { IPlanet } from "./planet";
import { IVehicle } from "./vehicle";

export interface IFalconAppState {
  searchMap: Map<string, ISearchAttempt>;
  availablePlanetListMap: Map<string, IPlanet[]>;
  availableVehicleListMap: Map<string, IVehicle[]>;
  planetList: IPlanet[];
  vehicleList: IVehicle[];
  unsearchedPlanets: IPlanet[];
  vehicleInventory: IVehicle[];
  maxSearchAttemptAllowed: number;
  totalTimeTaken: number;
  errorMsg: string;
  isLoading: boolean;
  planetFoundOn: string; // todo refactor will be moved to result component
  isReadyToSearch: boolean; // todo refactor will be moved to result component
  lastUpdatedWidgetId: number; // todo refactor will be removed
}
