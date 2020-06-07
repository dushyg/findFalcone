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
   * @param changedWidgetSearchAttempt  a SearchAttempt object that will be set for current widget
   * @param previousState Previous application state
   * @returns Next application state after planet or vehicle was changed
   */
  public static getNextStateAfterChange(
    changedWidgetId: number,
    changedWidgetSearchAttempt: ISearchAttempt,
    previousState: IFalconAppState
  ): IFalconAppState {
    // get updated search map
    const updatedSearchMap = this.getUpdatedSearchMap(
      previousState.searchMap,
      changedWidgetId,
      changedWidgetSearchAttempt
    );

    return {
      ...previousState,
      searchMap: updatedSearchMap,
      unsearchedPlanets: this.getUnsearchedPlanets(
        updatedSearchMap,
        previousState.planetList
      ),
      vehicleInventory: this.getUpdatedVehicleInventory(
        updatedSearchMap,
        previousState.vehicleList
      ),
      isReadyToSearch: this.isItFineToStartSearching(updatedSearchMap),
      totalTimeTaken: this.getTotalTimeTakenForSearch(
        updatedSearchMap,
        previousState.planetList,
        previousState.vehicleList
      ),
    } as IFalconAppState;
  }

  /**
   * This method returns updated search map that has a mapping of widget id to ISearchAttempt.
   * ISearchAttempt object holds the name of planet being searched and vehicle used for the search.
   * @returns Updated search map that has a mapping of widget id to ISearchAttempt
   * @param searchMap A Map of widget id to SearchAttempt object
   * @param changedWidgetId Id of the widget where planet or vehicle was changed
   * @param changedWidgetSearchAttempt  a SearchAttempt object that will be set for current widget
   */
  private static getUpdatedSearchMap(
    searchMap: Map<string, ISearchAttempt>,
    changedWidgetId: number,
    changedWidgetSearchAttempt: ISearchAttempt
  ): Map<string, ISearchAttempt> {
    return new Map<string, ISearchAttempt>(
      Array.from(
        searchMap,
        ChangeUtils.mapToUpdatedWidgetIdSearchAttemptPair(
          changedWidgetId,
          changedWidgetSearchAttempt
        )
      )
    );
  }

  private static mapToUpdatedWidgetIdSearchAttemptPair(
    changedWidgetId: number,
    changedWidgetSearchAttempt: ISearchAttempt
  ) {
    return function mapperFunction([key, value]): [string, ISearchAttempt] {
      let updatedSearchAttempt: ISearchAttempt;
      // if the current widget is to the left of changed widget or the changed widget then simply continue
      const currentlyLoopedWidgetId = Number(key);
      if (currentlyLoopedWidgetId < changedWidgetId) {
        updatedSearchAttempt = value; // { ...value } as ISearchAttempt;
      } else if (currentlyLoopedWidgetId === changedWidgetId) {
        updatedSearchAttempt = changedWidgetSearchAttempt;
      } else {
        // else if the current widget is to the right of the changed widget then
        // we will need to reset both the existing planet and vehicle selections if any
        updatedSearchAttempt = {
          vehicleUsed: null,
          searchedPlanet: null,
        } as ISearchAttempt;
      }
      return [key, updatedSearchAttempt];
    };
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
    const usedPlanetSet = [...searchMap].reduce(
      this.AddPlanetToSetIfUsed,
      new Set<string>()
    );

    return planetList.filter(
      (planet: IPlanet) => !usedPlanetSet.has(planet.name)
    );
  }

  private static AddPlanetToSetIfUsed(
    planetSet: Set<string>,
    [_, searchAttempt]: [string, ISearchAttempt]
  ) {
    if (searchAttempt && searchAttempt.searchedPlanet) {
      planetSet.add(searchAttempt.searchedPlanet);
    }
    return planetSet;
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
    return [...searchMap].reduce((usedVehicleMap, [_, searchAttempt]) => {
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
      return usedVehicleMap;
    }, new Map<string, number>());
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
    const nameToPlanetMap = new Map<string, IPlanet>(
      allPlanets.map((currentPlanet) => [currentPlanet.name, currentPlanet])
    );

    const nameToVehicleMap = new Map<string, IVehicle>(
      allVehicles.map((currentVehicle) => [currentVehicle.name, currentVehicle])
    );

    return [...searchMap].reduce((totalTime, [_, searchAttempt]) => {
      const searchedPlanetName = searchAttempt.searchedPlanet;
      const usedVehicleName = searchAttempt.vehicleUsed;
      if (!searchedPlanetName || !usedVehicleName) {
        return totalTime;
      }

      const planet: IPlanet = nameToPlanetMap.get(searchedPlanetName);
      const vehicle: IVehicle = nameToVehicleMap.get(usedVehicleName);
      const planetDistance = planet.distance;
      const vehicleSpeed = vehicle.speed;
      if (!planetDistance || !vehicleSpeed) {
        return totalTime;
      }

      totalTime = totalTime + planetDistance / vehicleSpeed;
      return totalTime;
    }, 0);
  }

  /**
   * This method returns true if all widgets have vehicle and planet values set by the user else false
   * @returns true if all widgets have vehicle and planet values set by the user
   * @param searchMap A Map of widget id to SearchAttempt object
   */
  private static isItFineToStartSearching(
    searchMap: Map<string, ISearchAttempt>
  ): boolean {
    return [...searchMap].every(
      ([_, searchAttempt]): boolean =>
        !!(
          searchAttempt &&
          searchAttempt.searchedPlanet &&
          searchAttempt.vehicleUsed
        )
    );
  }
}
