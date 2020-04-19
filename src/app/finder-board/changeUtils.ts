import { ISearchAttempt } from "./models/searchAttempt";
import { IPlanet } from "./models/planet";
import { IVehicle } from "./models/vehicle";
import { IFalconAppState } from "./models/falconApp.state";

export class ChangeUtils {
  public static getNextStateAfterChange(
    changedWidgetId: number,
    changedValue: string,
    changedWidgetSearchAttemptGetter: () => ISearchAttempt,
    previousState: IFalconAppState
  ): IFalconAppState {
    const updatedSearchMap = ChangeUtils.getUpdatedSearchMap(
      previousState.searchMap,
      changedWidgetId,
      changedValue,
      changedWidgetSearchAttemptGetter
    );

    // find unsearched planets after this planet change
    const unsearchedPlanets: IPlanet[] = ChangeUtils.getUnsearchedPlanets(
      updatedSearchMap,
      previousState.planetList
    );

    // update the vehicle inventory, taking into account used and freed vehicles
    const updatedVehicleInventory: IVehicle[] = ChangeUtils.getUpdatedVehicleInventory(
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
      unsearchedPlanets,
      vehicleInventory: updatedVehicleInventory,
      isReadyToSearch,
      totalTimeTaken: totalTimeTakenForSearch,
    };
  }

  private static getUpdatedSearchMap(
    searchMap: Map<string, ISearchAttempt>,
    changedWidgetId: number,
    changedValue: string,
    changedWidgetSearchAttemptGetter: () => ISearchAttempt
  ): Map<string, ISearchAttempt> {
    let updatedSearchMap = new Map<string, ISearchAttempt>();

    searchMap.forEach((value: ISearchAttempt, key: string) => {
      let updatedSearchAttempt: ISearchAttempt;
      // if the current widget is to the left of changed widget or the changed widget then
      // just make a clone for immutability and continue
      const currentlyLoopedWidgetId = Number(key);
      if (currentlyLoopedWidgetId < changedWidgetId) {
        updatedSearchAttempt = <ISearchAttempt>{ ...value };
      } else if (currentlyLoopedWidgetId == changedWidgetId) {
        updatedSearchAttempt = changedWidgetSearchAttemptGetter();
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

  private static getUnsearchedPlanets(
    searchMap: Map<string, ISearchAttempt>,
    planetList: IPlanet[]
  ): IPlanet[] {
    const usedPlanetSet = new Set<string>();

    searchMap.forEach((searchAttempt: ISearchAttempt) => {
      if (searchAttempt && searchAttempt.searchedPlanet) {
        usedPlanetSet.add(searchAttempt.searchedPlanet);
      }
    });

    return planetList.filter(
      (planet: IPlanet) => !usedPlanetSet.has(planet.name)
    );
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
  }

  private static getTotalTimeTakenForSearch(
    searchMap: Map<string, ISearchAttempt>,
    allPlanets: IPlanet[],
    allVehicles: IVehicle[]
  ): number {
    let totalTimeTakenForSearch: number = 0;

    const nameToPlanetMap: Map<string, IPlanet> = new Map<string, IPlanet>();
    const nameToVehicleMap: Map<string, IVehicle> = new Map<string, IVehicle>();

    allPlanets.forEach((planet) => {
      nameToPlanetMap.set(planet.name, planet);
    });

    allVehicles.forEach((vehicle) => {
      nameToVehicleMap.set(vehicle.name, vehicle);
    });

    searchMap.forEach((value: ISearchAttempt) => {
      if (!value) {
        return;
      }

      if (!value.searchedPlanet || !value.vehicleUsed) {
        return;
      }

      const planet: IPlanet = nameToPlanetMap.get(value.searchedPlanet);
      const vehicle: IVehicle = nameToVehicleMap.get(value.vehicleUsed);
      const planetDistance = planet.distance;
      const vehicleSpeed = vehicle.speed;
      if (!planetDistance || !vehicleSpeed) {
        return;
      }

      totalTimeTakenForSearch =
        totalTimeTakenForSearch + planetDistance / vehicleSpeed;
    });

    return totalTimeTakenForSearch;
  }

  private static isItFineToStartSearching(
    searchMap: Map<string, ISearchAttempt>
  ): boolean {
    let isReadyForSearch: boolean = true;

    searchMap.forEach((value: ISearchAttempt) => {
      if (!value) {
        isReadyForSearch = false;
        return;
      }

      if (!value.searchedPlanet || !value.vehicleUsed) {
        isReadyForSearch = false;
        return;
      }
    });

    return isReadyForSearch;
  }
}
