// Encapsulating state field access via a getter function.
// This will insulate other code from changes to state structure.

import { IFalconAppState } from '../models/falconApp.state';

export const getErrorMsg = (state: IFalconAppState) => state.errorMsg;

export const getSearchAttemptMap = (state: IFalconAppState) => state.searchMap;

export const getTotalTimeTaken = (state: IFalconAppState) =>
  state.totalTimeTaken;

export const getIsReadyToSearch = (state: IFalconAppState) =>
  state.isReadyToSearch;

export const getIsLoading = (state: IFalconAppState) => state.isLoading;

export const getUnsearchedPlanets = (state: IFalconAppState) =>
  state.unsearchedPlanets;

export const getVehicleInventory = (state: IFalconAppState) =>
  state.vehicleInventory;
