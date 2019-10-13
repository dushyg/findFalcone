import { Injectable, OnInit } from '@angular/core';
import { ISearchAttempt } from './models/searchAttempt';
import { IPlanet } from './models/planet';
import { IVehicle } from './models/vehicle';
import { IFalconAppState } from './models/falconApp.state';
import { CoreModule } from './core.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({providedIn : CoreModule})
export class FalconeAppStateService
{
    
    private _state : IFalconAppState = {
        errorMsg : "",
        isLoading : false,
        maxSearchAttemptAllowed : 4,
        planetList : [],
        searchMap : new Map<string, ISearchAttempt>(),
        totalTimeTaken : 0,
        vehicleList : [],
        planetFoundOn : null,
        isReadyToSearch : false
      };            
      
    private store = new BehaviorSubject<IFalconAppState>(this._state);
      // private methods

  public getStore() : Observable<IFalconAppState> {

    return this.store.asObservable();
  }
      
  public getAppState() : IFalconAppState {
      return this._state;
  }
    
  public setAppState(state : IFalconAppState) {

    // update the _state variable to reflect latest state
    this._state = state;

    this.store.next(this._state);
    
  }
  
  public updatePlanetFoundOn(planetFoundOn : string) : void {
    
    this.setAppState({ ...this.getAppState(), planetFoundOn});    
  }
  
  public setMaxSearchAttemptAllowed(maxSearchAttemptAllowed : number) : void {

    this.setAppState({...this.getAppState(), maxSearchAttemptAllowed});
  }
    
  public updateError(err : any) : void { 
    console.log('setError', err);
    let errorMsg = 'Some error occurred!';
    if(err && typeof(err) !== 'string') {
      if(err.message) {
        errorMsg = err.message;
      }
      else if(err.error){
        if(typeof(err.error) === 'string'){
          errorMsg = err.error;
        }
        else if(err.error.error && typeof(err.error.error) === 'string') {
          errorMsg = err.error.error;
        }          
      }      
    }
    else {
      errorMsg = err; 
    }
    
    this.setAppState({ ...this.getAppState(), errorMsg});
  }      
  
  public getReadyWidgetState(searchAttemptMap : Map<string, ISearchAttempt>) : { readyWidgetCount : number, totalTimeTaken : number} {

    let readyWidgetCount = 0;
    let totalTimeTaken = 0;

      for(let searchAttempt of searchAttemptMap.values()) {

          if(searchAttempt.vehicleUsed && searchAttempt.searchedPlanet) {
            readyWidgetCount++;
            totalTimeTaken += (searchAttempt.searchedPlanet.distance / searchAttempt.vehicleUsed.speed);
          }          
      }

      return {
        readyWidgetCount ,
        totalTimeTaken
      };
  }

  // selector methods

  public getVehicleList() : IVehicle[] {

    return this.getAppState().vehicleList;
  }

  public getPlanetList() : IPlanet[] {

    return this.getAppState().planetList;
  }

  public getVehicleByName(vehicleName : string) : IVehicle {

    if(vehicleName) {
      return this.getVehicleList().find( v => v.name === vehicleName);
    }
    return null;
  }

  public getPlanetByName(planetName : string) : IPlanet {

    if(planetName) {
      return this.getPlanetList().find( p => p.name === planetName);
    }
    return null;
  }

  public getSearchMap() : Map<string, ISearchAttempt> {

    return this.getAppState().searchMap;
  }

  public getMaxSearchAttemptAllowed()  : number {

    return this.getAppState().maxSearchAttemptAllowed;
  }
  
}