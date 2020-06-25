import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as selectors from '../finder-board/selectors';
import { ChangeUtils } from '../finder-board/changeUtils';

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

/**
 * Service Facade class that encapsulates all falcone api services used
 */
@Injectable({
  providedIn: 'root',
})
export class FinderFacadeService {
  /**
   *
   * @param planetService Service instance that fetches planets
   * @param vehicleService Service instance that fetches vehicles
   * @param tokenService Service instance that fetches token to be passed with each api call
   * @param router Angular Router Service instance
   */
  constructor(
    private planetService: PlanetsService,
    private vehicleService: VehiclesService,
    private tokenService: FalconeTokenService,
    private router: Router
  ) {}

  private finderApiToken: string;
  private readonly MAX_SEARCH_ATTEMPTS_ALLOWED = 4;

  /**
   *  initial app state
   */
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

  /**
   * Observable stream for application state
   */
  private store$ = this.store.asObservable();

  /**
   * An observable stream of error message to be shown to the user if any
   */
  public error$ = this.store$.pipe(map(selectors.getErrorMsg));

  /**
   * An observable stream of the current mapping of planets set for search and the vehicles
   * used for search for all the widgets
   */
  private searchAttemptMap$ = this.store$.pipe(
    map(selectors.getSearchAttemptMap),
    distinctUntilChanged()
  );

  /**
   * An observable stream that tells the total time that will be required for searching
   * the Falcone based on current planets distances and vehicles selected
   */
  public totalTimeTaken$ = this.store$.pipe(
    map(selectors.getTotalTimeTaken),
    distinctUntilChanged()
  );

  /**
   * An observable stream that tells if user has filled in all planets and vehicles
   * so that Falone search api can be invoked or not
   */
  public readyToSearch$ = this.store$.pipe(
    map(selectors.getIsReadyToSearch),
    distinctUntilChanged()
  );

  /**
   * An observable stream that tells if an api call is in progress or not
   */
  public isLoading$ = this.store$.pipe(
    map(selectors.getIsLoading),
    distinctUntilChanged()
  );

  /**
   * An observable stream that emits planets that have not been searched yet
   */
  public unsearchedPlanets$ = this.store$.pipe(
    map(selectors.getUnsearchedPlanets),
    distinctUntilChanged()
  );

  /**
   * An observable stream that emits current state of the vehicles
   */
  public vehicleInventory$ = this.store$.pipe(
    map(selectors.getVehicleInventory),
    distinctUntilChanged()
  );

  private planetChangedSubject = new Subject<PlanetChange>();
  /**
   * An observable stream that emits when a planet is changed in a widget
   */
  public planetChangedAction$ = this.planetChangedSubject.asObservable();

  private vehicleChangedSubject = new Subject<VehicleChange>();
  /**
   * An observable stream that emits when a vehicle is changed in a widget
   */
  public vehicleChangedAction$ = this.vehicleChangedSubject.asObservable();

  /**
   * A convinience observable stream emiting related info used by the views,
   * so that a view doesnt have to subscribe to multiple streams itself
   */
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
  /**
   * A method that gives count of planets that must be searched to find Falcone
   * @returns Count of planets that must be searched to find Falcone
   */
  public getCountOfWidgetsDisplayed(): number {
    return this.MAX_SEARCH_ATTEMPTS_ALLOWED;
  }

  /**
   * This method initializes the app state by calling various APIs required.
   * It fetches the planets, vehicles and the token required to invoke find Falcone api.
   */
  public initializeAppData(): void {
    forkJoin([
      this.vehicleService.getAllVehicles(),
      this.planetService.getAllPlanets(),
      this.tokenService.getFalconeFinderApiToken(),
    ]).subscribe(
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
          searchMap: this.getInitializedSearchMap(
            this.MAX_SEARCH_ATTEMPTS_ALLOWED
          ),
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

  /**
   * Creates a brand new search map, which is a map of widgetId to SearchAttempt.
   * SearchAttempt contains name of the planet searched and name of the vehicle used for searching.
   * @returns A map of widgetId to SearchAttempt
   */
  private getInitializedSearchMap(
    widgetCount: number
  ): Map<string, ISearchAttempt> {
    return new Map<string, ISearchAttempt>(
      Array.from(new Array(widgetCount), (_, index) => [
        (index + 1).toString(),
        {} as ISearchAttempt,
      ])
    );
  }

  /**
   * This method is invoked by the view when a planet is changed / set in any widget.
   * It modifies application state to set the planets & vehicles available for search after this planet change.
   * @param planetChange An object representing the changed planet and the widget id where change happened
   */
  public planetChanged(planetChange: PlanetChange): void {
    const nextState: IFalconAppState = ChangeUtils.getNextStateAfterChange(
      planetChange.widgetId,
      {
        searchedPlanet:
          planetChange.newPlanetName !== 'Select'
            ? planetChange.newPlanetName
            : null,
        vehicleUsed: null,
      } as ISearchAttempt,
      this.state
    );

    this.updateState(nextState);
    this.planetChangedSubject.next(planetChange);
  }

  /**
   * This method is invoked by the view when a vehicle is changed / set in any widget.
   * It modifies application state to set the planets & vehicles available for search after this vehicle change.
   * @param vehicleChange An object representing the changed vehicle and the widget id where change happened
   */
  public vehicleChanged(vehicleChange: VehicleChange): void {
    const changedWidgetId = vehicleChange.widgetId.toString();

    const nextState: IFalconAppState = ChangeUtils.getNextStateAfterChange(
      vehicleChange.widgetId,
      {
        searchedPlanet: selectors
          .getSearchAttemptMap(this.state)
          .get(changedWidgetId).searchedPlanet,
        vehicleUsed: vehicleChange.newVehicleName,
      } as ISearchAttempt,
      this.state
    );

    this.updateState(nextState);
    this.vehicleChangedSubject.next(vehicleChange);
  }

  /**
   * Called when the view needs to reset / reinitialize the application state.
   */
  resetApp(): void {
    this.setLoadingFlag(true);
    this.router.navigate(['reset']);
  }

  /**
   * This method is called with isLoading = true to indicate app is not ready for user interaction.
   * Will be called with isLoading = false to indicate app is available for user interaction.
   * @param isLoading boolean flag that sets up application ready state
   */
  public setLoadingFlag(isLoading: boolean): void {
    this.updateState({ ...this.state, isLoading: isLoading || false });
  }

  /**
   * This method is called to set an error message to be displayed to the user.
   * @param errorMsg The error message string to be displayed
   */
  public updateError(errorMsg: string): void {
    this.updateState({ ...this.state, errorMsg });
  }

  /**
   * This method is called to replace current app state with the passed in state
   * @param state Instance of IFalconAppState that will replace the current state
   */
  private updateState(state: IFalconAppState): void {
    this.store.next((this.state = state));
  }

  /**
   * This method is called to obtain the token for Falcone search api
   * @returns The token needed to be passed to Falcone search api for it to work
   */
  public getFinderApiToken(): string {
    return this.finderApiToken;
  }
}
