import { ISearchAttempt } from './models/searchAttempt';
import { IPlanet } from './models/planet';
import { IVehicle } from './models/vehicle';
import { IFalconAppState } from './models/falconApp.state';

/**
 * Utility that calculates changes to state required after every planet / vehicle change
 */
export class ChangeUtils {
  /**
   * This method is called to calculate the new application state after a vehicle or planet was set or changed in a widget.
   * @param changedWidgetId Id of the widget where planet or vehicle was changed
   * @param changedValue New name of the planet or vehicle after the change
   * @param changedWidgetSearchAttemptGetter A function that returns new SearchAttempt object that will be set
   * @param previousState Previous application state
   * @returns Next application state after planet or vehicle was changed
   */
  public static getNextStateAfterChange(
    changedWidgetId: number,
    changedValue: string,
    changedWidgetSearchAttemptGetter: () => ISearchAttempt,
    previousState: IFalconAppState
  ): IFalconAppState {
    // get updated search map
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

    // sets true if all widgets have vehicle and planet values set by the user
    const isReadyToSearch: boolean = ChangeUtils.isItFineToStartSearching(
      updatedSearchMap
    );

    return {
      ...previousState,
      searchMap: updatedSearchMap,
      unsearchedPlanets,
      vehicleInventory: updatedVehicleInventory,
      isReadyToSearch,
      totalTimeTaken: totalTimeTakenForSearch,
    } as IFalconAppState;
  }

  /**
   * This method returns updated search map that has a mapping of widget id to ISearchAttempt.
   * ISearchAttempt object holds the name of planet being searched and vehicle used for the search.
   * @returns Updated search map that has a mapping of widget id to ISearchAttempt
   * @param searchMap A Map of widget id to SearchAttempt object
   * @param changedWidgetId Id of the widget where planet or vehicle was changed
   * @param changedValue New name of the planet or vehicle after the change
   * @param changedWidgetSearchAttemptGetter A function that returns new SearchAttempt object that will be set
   */
  private static getUpdatedSearchMap(
    searchMap: Map<string, ISearchAttempt>,
    changedWidgetId: number,
    changedValue: string,
    changedWidgetSearchAttemptGetter: () => ISearchAttempt
  ): Map<string, ISearchAttempt> {
    const updatedSearchMap = new Map<string, ISearchAttempt>();

    searchMap.forEach((value: ISearchAttempt, key: string) => {
      let updatedSearchAttempt: ISearchAttempt;
      // if the current widget is to the left of changed widget or the changed widget then simply continue
      const currentlyLoopedWidgetId = Number(key);
      if (currentlyLoopedWidgetId < changedWidgetId) {
        updatedSearchAttempt = value; // { ...value } as ISearchAttempt;
      } else if (currentlyLoopedWidgetId === changedWidgetId) {
        updatedSearchAttempt = changedWidgetSearchAttemptGetter();
      } else {
        // else if the current widget is to the right of the changed widget then
        // we will need to reset both the existing planet and vehicle selections if any
        updatedSearchAttempt = {
          vehicleUsed: null,
          searchedPlanet: null,
        } as ISearchAttempt;
      }

      updatedSearchMap.set(key, updatedSearchAttempt);
    });
    return updatedSearchMap;
  }

  /**
   * This method returns a list of planets that have not been searched yet.
   * @returns List of planets that have not been searched yet
   * @param searchMap A mapping of widget id to ISearchAttempt
   * @param planetList List of all planets
   */
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

  /**
   * This method returns a list of vehicles with updated available units
   * @returns List of vehicles with updated available units
   * @param searchMap A mapping of widget id to ISearchAttempt
   * @param vehicleList List of all vehicles
   */
  private static getUpdatedVehicleInventory(
    searchMap: Map<string, ISearchAttempt>,
    vehicleList: IVehicle[]
  ): IVehicle[] {
    // create a map of vehicle name vs count of vehicles used
    const usedVehicleMap = this.getUsedVehicleMap(searchMap);

    // update vehicle list with available vehicle units
    const updatedVehicleList: IVehicle[] = vehicleList.map((vehicle) => {
      const totalNumUnits = vehicle.totalNumUnits;
      return {
        ...vehicle,
        availNumUnits: totalNumUnits - (usedVehicleMap.get(vehicle.name) || 0),
      } as IVehicle;
    });

    return updatedVehicleList;
  }

  /**
   * @returns A mapping of vehicle name and count of vehicles already used for search
   * @param searchMap A mapping of widget id to ISearchAttempt
   */
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

  /**
   *
   * @param searchMap A mapping of widget id to ISearchAttempt
   * @param allPlanets List of all planets
   * @param allVehicles List of all vehicles
   */
  private static getTotalTimeTakenForSearch(
    searchMap: Map<string, ISearchAttempt>,
    allPlanets: IPlanet[],
    allVehicles: IVehicle[]
  ): number {
    let totalTimeTakenForSearch = 0;

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

  /**
   * This method returns true if all widgets have vehicle and planet values set by the user else false
   * @returns true if all widgets have vehicle and planet values set by the user
   * @param searchMap A Map of widget id to SearchAttempt object
   */
  private static isItFineToStartSearching(
    searchMap: Map<string, ISearchAttempt>
  ): boolean {
    let isReadyForSearch = true;

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
