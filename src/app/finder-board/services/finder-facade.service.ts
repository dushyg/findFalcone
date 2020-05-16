import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as selectors from '../selectors';
import { ChangeUtils } from '../changeUtils';

import {
  IFalconAppState,
  PlanetChange,
  VehicleChange,
  IVehicle,
  IPlanet,
  ISearchAttempt,
} from '../models';
import { PlanetsService } from './planets.service';
import { VehiclesService } from './vehicles.service';
import { FalconeTokenService } from './falcone-token.service';

@Injectable({
  providedIn: 'root',
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
  private state: IFalconAppState = {
    errorMsg: '',
    isLoading: false,
    planetList: [],
    vehicleList: [],
    unsearchedPlanets: null,
    vehicleInventory: null,
    searchMap: null,
    totalTimeTaken: 0,
    isReadyToSearch: false,
  };

  private store = new BehaviorSubject<IFalconAppState>(this.state);

  private store$ = this.store.asObservable();

  public error$ = this.store$.pipe(map(selectors.getErrorMsg));

  private searchAttemptMap$ = this.store$.pipe(
    map(selectors.getSearchAttemptMap),
    distinctUntilChanged()
  );

  public totalTimeTaken$ = this.store$.pipe(
    map(selectors.getTotalTimeTaken),
    distinctUntilChanged()
  );

  public readyToSearch$ = this.store$.pipe(
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

  public getCountOfWidgetsDisplayed() {
    return this.MAX_SEARCH_ATTEMPTS_ALLOWED;
  }

  public initializeAppData() {
    this.setLoadingFlag(true);
    forkJoin(
      this.vehicleService.getAllVehicles(),
      this.planetService.getAllPlanets(),
      this.tokenService.getFalconeFinderApiToken()
    ).subscribe(
      ([vehicles, planets, tokenObj]: [
        IVehicle[],
        IPlanet[],
        { token: string }
      ]) => {
        this.finderApiToken = tokenObj.token;
        this.updateState({
          ...this.state,
          planetList: planets,
          vehicleList: vehicles,
          unsearchedPlanets: [...planets],
          vehicleInventory: [...vehicles],
          searchMap: this.getInitializedSearchMap(),
          errorMsg: '',
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
      searchMap.set(index.toString(), {} as ISearchAttempt);
    }
    return searchMap;
  }

  public planetChanged(planetChange: PlanetChange) {
    const nextState: IFalconAppState = ChangeUtils.getNextStateAfterChange(
      planetChange.widgetId,
      planetChange.newPlanetName,
      () => {
        return {
          searchedPlanet:
            planetChange.newPlanetName !== 'Select'
              ? planetChange.newPlanetName
              : null,
          vehicleUsed: null,
        } as ISearchAttempt;
      },
      this.state
    );

    this.updateState(nextState);
    this.planetChangedSubject.next(planetChange);
  }

  public vehicleChanged(vehicleChange: VehicleChange) {
    const changedWidgetId = vehicleChange.widgetId.toString();

    const nextState: IFalconAppState = ChangeUtils.getNextStateAfterChange(
      vehicleChange.widgetId,
      vehicleChange.newVehicleName,
      () => {
        return {
          searchedPlanet: selectors
            .getSearchAttemptMap(this.state)
            .get(changedWidgetId).searchedPlanet,
          vehicleUsed: vehicleChange.newVehicleName,
        } as ISearchAttempt;
      },
      this.state
    );

    this.updateState(nextState);
    this.vehicleChangedSubject.next(vehicleChange);
  }

  resetApp() {
    this.router.navigate(['reset']);
  }

  public setLoadingFlag(isLoading: boolean): void {
    this.updateState({ ...this.state, isLoading: isLoading || false });
  }

  public updateError(errorMsg: string) {
    this.updateState({ ...this.state, errorMsg });
  }

  private updateState(state: IFalconAppState) {
    this.store.next((this.state = state));
  }

  public getFinderApiToken(): string {
    return this.finderApiToken;
  }
}
