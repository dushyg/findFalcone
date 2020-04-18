import { Injectable } from "@angular/core";
import { PlanetsService } from "./planets.service";
import { VehiclesService } from "./vehicles.service";
import { IPlanet } from "./models/planet";
import { BehaviorSubject, forkJoin, combineLatest, Subject } from "rxjs";
import { IVehicle } from "./models/vehicle";
import { ISearchAttempt } from "./models/searchAttempt";
import { IFalconAppState } from "./models/falconApp.state";
import { map, distinctUntilChanged, filter } from "rxjs/operators";
import { Router } from "@angular/router";
import PlanetChange from "./models/planetChange";
import VehicleChange from "./models/vehicleChange";
import * as selectors from "./selectors";
import { ChangeUtils } from "./changeUtils";
import { FalconeTokenService } from "./falconeToken.service";

@Injectable({
  providedIn: "root",
})
export class FinderFacadeService {
  constructor(
    private planetService: PlanetsService,
    private vehicleService: VehiclesService,
    private tokenService: FalconeTokenService,
    private router: Router
  ) {}

  private finderApiToken: string;
  private readonly MAX_SEARCH_ATTEMPTS_ALLOWED = 4;
  private _state: IFalconAppState = {
    errorMsg: "",
    isLoading: false,
    planetList: [],
    vehicleList: [],
    unsearchedPlanets: null,
    vehicleInventory: null,
    searchMap: null,
    totalTimeTaken: 0,
    isReadyToSearch: false,
  };

  private store = new BehaviorSubject<IFalconAppState>(this._state);

  private store$ = this.store.asObservable();

  private error$ = this.store$.pipe(map(selectors.getErrorMsg));

  private searchAttemptMap$ = this.store$.pipe(
    map(selectors.getSearchAttemptMap),
    distinctUntilChanged()
  );

  private totalTimeTaken$ = this.store$.pipe(
    map(selectors.getTotalTimeTaken),
    distinctUntilChanged()
  );

  private readyToSearch$ = this.store$.pipe(
    map(selectors.getIsReadyToSearch),
    distinctUntilChanged()
  );

  public isLoading$ = this.store$.pipe(
    map(selectors.getIsLoading),
    distinctUntilChanged()
  );

  public unsearchedPlanets$ = this.store$.pipe(
    map(selectors.getUnsearchedPlanets),
    distinctUntilChanged()
  );

  public vehicleInventory$ = this.store$.pipe(
    map(selectors.getVehicleInventory),
    distinctUntilChanged()
  );

  private planetChangedSubject = new Subject<PlanetChange>();
  public planetChangedAction$ = this.planetChangedSubject.asObservable();

  private vehicleChangedSubject = new Subject<VehicleChange>();
  public vehicleChangedAction$ = this.vehicleChangedSubject.asObservable();

  public getCountOfWidgetsDisplayed() {
    return this.MAX_SEARCH_ATTEMPTS_ALLOWED;
  }

  public dashboardVm$ = combineLatest([
    this.error$,
    this.totalTimeTaken$,
    this.readyToSearch$,
    this.isLoading$,
    this.searchAttemptMap$,
  ]).pipe(
    map(
      ([
        error,
        totalTimeTaken,
        isReadyForSearch,
        isLoading,
        searchAttemptMap,
      ]) => {
        return {
          error,
          totalTimeTaken,
          isReadyForSearch,
          isLoading,
          searchAttemptMap,
        };
      }
    )
  );

  public initializeAppData() {
    this.setLoadingFlag(true);
    forkJoin(
      this.vehicleService.getAllVehicles(),
      this.planetService.getAllPlanets(),
      this.tokenService.getFalconeFinderApiToken()
    ).subscribe(
      (response) => {
        this.finderApiToken = response[2].token;
        const vehicleList: IVehicle[] = response[0];
        const planetList: IPlanet[] = response[1];

        // todo handle error scenarios
        this.updateState({
          ...this._state,
          planetList,
          vehicleList,
          unsearchedPlanets: [...planetList],
          vehicleInventory: [...vehicleList],
          searchMap: this.getInitializedSearchMap(),
          errorMsg: "",
          isLoading: false,
          isReadyToSearch: false,
          totalTimeTaken: 0,
        });
      },
      (error) => {
        this.updateError(error);
        this.setLoadingFlag(false);
      }
    );
  }

  private getInitializedSearchMap(): Map<string, ISearchAttempt> {
    const searchMap = new Map<string, ISearchAttempt>();

    for (let index = 1; index < this.MAX_SEARCH_ATTEMPTS_ALLOWED + 1; index++) {
      searchMap.set(index.toString(), <ISearchAttempt>{});
    }
    return searchMap;
  }

  public planetChanged(planetChange: PlanetChange) {
    const nextState: IFalconAppState = ChangeUtils.getNextStateAfterChange(
      planetChange.widgetId,
      planetChange.newPlanetName,
      () => {
        return <ISearchAttempt>{
          searchedPlanet:
            planetChange.newPlanetName != "Select"
              ? planetChange.newPlanetName
              : null,
          vehicleUsed: null,
        };
      },
      this._state
    );

    this.updateState(nextState);
    this.planetChangedSubject.next(planetChange);
  }

  getUnsearchedPlanets(
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

  public vehicleChanged(vehicleChange: VehicleChange) {
    const changedWidgetId = vehicleChange.widgetId.toString();

    const nextState: IFalconAppState = ChangeUtils.getNextStateAfterChange(
      vehicleChange.widgetId,
      vehicleChange.newVehicleName,
      () => {
        return <ISearchAttempt>{
          searchedPlanet: selectors
            .getSearchAttemptMap(this._state)
            .get(changedWidgetId).searchedPlanet,
          vehicleUsed: vehicleChange.newVehicleName,
        };
      },
      this._state
    );

    this.updateState(nextState);
    this.vehicleChangedSubject.next(vehicleChange);
  }

  resetApp() {
    this.router.navigate(["reset"]);
  }

  public setLoadingFlag(isLoading: boolean): void {
    this.updateState({ ...this._state, isLoading: isLoading || false });
  }

  public updateError(errorMsg: string) {
    this.updateState({ ...this._state, errorMsg });
  }

  private updateState(state: IFalconAppState) {
    this.store.next((this._state = state));
  }

  public getFinderApiToken(): string {
    return this.finderApiToken;
  }
}
