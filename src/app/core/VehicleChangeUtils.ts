import PlanetChange from "./models/planetChange";
import { IFalconAppState } from "./models/falconApp.state";
import VehicleChange from "./models/vehicleChange";
import { ISearchAttempt } from "./models/searchAttempt";
import { IVehicle } from "./models/vehicle";
import { ChangeUtils } from "./ChangeUtils";

class VehicleChangeUtils {
  /*
  public static getNextStateAfterVehicleChange(
    vehicleChange: VehicleChange,
    previousState: IFalconAppState
  ): IFalconAppState {
    const updatedSearchMap = VehicleChangeUtils.getUpdatedSearchMap(
      previousState.searchMap,
      vehicleChange
    );

    const updatedVehicleInventory: IVehicle[] = VehicleChangeUtils.getUpdatedVehicleInventory(
      updatedSearchMap,
      previousState.vehicleList
    );

    // calculate the total time taken to search planets with vehicles selected
    const totalTimeTakenForSearch: number = ChangeUtils.getTotalTimeTakenForSearch(
      updatedSearchMap,
      previousState.planetList,
      previousState.vehicleList
    );

    const isReadyToSearch: boolean = ChangeUtils.isItFineToStartSearching(
      updatedSearchMap
    );

    return <IFalconAppState>{
      ...previousState,
      searchMap: updatedSearchMap,
      vehicleInventory: updatedVehicleInventory,
      isReadyToSearch,
      totalTimeTaken: totalTimeTakenForSearch,
    };
  }

  private static getUpdatedSearchMap(
    searchMap: Map<string, ISearchAttempt>,
    vehicleChange: VehicleChange
  ): Map<string, ISearchAttempt> {
    let updatedSearchMap = new Map<string, ISearchAttempt>();

    searchMap.forEach((value: ISearchAttempt, key: string) => {
      let updatedSearchAttempt: ISearchAttempt;
      // if the current widget is to the left of changed widget then
      // just make a clone for immutability and continue
      const currentlyLoopedWidgetId = Number(key);
      if (currentlyLoopedWidgetId < vehicleChange.widgetId) {
        updatedSearchAttempt = <ISearchAttempt>{ ...value };
      } else if (currentlyLoopedWidgetId == vehicleChange.widgetId) {
        updatedSearchAttempt = <ISearchAttempt>{
          searchedPlanet: value.searchedPlanet,
          vehicleUsed: vehicleChange.newVehicleName,
        };
      } else {
        // else if the current widget is to the right of the changed widget then
        // we will need to reset both the existing planet and vehicle selections if any
        updatedSearchAttempt = <ISearchAttempt>{
          vehicleUsed: null,
          searchedPlanet: null,
        };
      }

      updatedSearchMap.set(key, updatedSearchAttempt);
    });
    return updatedSearchMap;
  }

  private static getUpdatedVehicleInventory(
    searchMap: Map<string, ISearchAttempt>,
    vehicleList: IVehicle[]
  ): IVehicle[] {
    // create a map of vehicle name vs count of vehicles used
    const usedVehicleMap = this.getUsedVehicleMap(searchMap);

    // update vehicle list with available vehicle units
    let updatedVehicleList: IVehicle[] = vehicleList.map((vehicle) => {
      const totalNumUnits = vehicle.totalNumUnits;
      return <IVehicle>{
        ...vehicle,
        availNumUnits: totalNumUnits - (usedVehicleMap.get(vehicle.name) || 0),
      };
    });

    return updatedVehicleList;
  }

  private static getUsedVehicleMap(
    searchMap: Map<string, ISearchAttempt>
  ): Map<string, number> {
    const usedVehicleMap = new Map<string, number>();
    for (let index = 1; index < searchMap.size + 1; index++) {
      const key = index.toString();
      const searchAttempt: ISearchAttempt = searchMap.get(key);
      if (searchAttempt) {
        const vehicle: string = searchAttempt.vehicleUsed;
        if (vehicle) {
          let count: number = usedVehicleMap.get(vehicle);
          if (Number(count)) {
            usedVehicleMap.set(vehicle, ++count);
          } else {
            usedVehicleMap.set(vehicle, 1);
          }
        }
      }
    }
    return usedVehicleMap;
  }*/
}
