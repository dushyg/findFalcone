//Encapsulating state field access via a getter function.
// This will insulate other code from changes to state structure.

export const getErrorMsg = (state) => state.errorMsg;

export const getSearchAttemptMap = (state) => state.searchMap;

export const getTotalTimeTaken = (state) => state.totalTimeTaken;

export const getIsReadyToSearch = (state) => state.isReadyToSearch;

export const getIsLoading = (state) => state.isLoading;

export const getUnsearchedPlanets = (state) => state.unsearchedPlanets;

export const getVehicleInventory = (state) => state.vehicleInventory;
