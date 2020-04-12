import { IFalconAppState } from "./models/falconApp.state";
import { ISearchAttempt } from "./models/searchAttempt";
import { IPlanet } from "./models/planet";
import PlanetChange from "./models/planetChange";
import { ChangeUtils } from "./ChangeUtils";

export class PlanetChangeUtils {
  /*
  public static getNextStateAfterPlanetChange(
    planetChange: PlanetChange,
    previousState: IFalconAppState
  ): IFalconAppState {
    const updatedSearchMap = PlanetChangeUtils.getUpdatedSearchMap(
      previousState.searchMap,
      planetChange
    );

    // find unsearched planets after this planet change
    const unsearchedPlanets: IPlanet[] = PlanetChangeUtils.getUnsearchedPlanets(
      updatedSearchMap,
      previousState.planetList
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
      isReadyToSearch,
      totalTimeTaken: totalTimeTakenForSearch,
    };
  }

  private static getUpdatedSearchMap(
    searchMap: Map<string, ISearchAttempt>,
    planetChange: PlanetChange
  ): Map<string, ISearchAttempt> {
    let updatedSearchMap = new Map<string, ISearchAttempt>();

    searchMap.forEach((value: ISearchAttempt, key: string) => {
      let updatedSearchAttempt: ISearchAttempt;
      // if the current widget is to the left of changed widget or the changed widget then
      // just make a clone for immutability and continue
      const currentlyLoopedWidgetId = Number(key);
      if (currentlyLoopedWidgetId < planetChange.widgetId) {
        updatedSearchAttempt = <ISearchAttempt>{ ...value };
      } else if (currentlyLoopedWidgetId == planetChange.widgetId) {
        updatedSearchAttempt = <ISearchAttempt>{
          searchedPlanet:
            planetChange.newPlanetName != "Select"
              ? planetChange.newPlanetName
              : null,
          vehicleUsed: null,
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
  }*/
}
