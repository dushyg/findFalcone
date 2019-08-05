import { Injectable, OnInit } from '@angular/core';
import { ISearchAttempt } from './models/searchAttempt';
import { stringify } from 'querystring';
import { IPlanet } from './models/planet';
import { IVehicle } from './models/vehicle';

@Injectable({providedIn : 'root'})
export class AppStateService implements OnInit
{
    
    private searchMap : Map<string, ISearchAttempt>;

    private allPlanetList : IPlanet[];

    private vehicleList : IVehicle[];

    public get maxSearchAttempt() : number {

        return 4;
    };

    ngOnInit(): void {
            
    }

    public setPlanetList(planetList : IPlanet[]) {

        this.allPlanetList = Object.assign({}, planetList);
    } 

    public setVehicleList(vehicleList : IVehicle[]) {
        this.vehicleList = Object.assign( {}, vehicleList);
    }

    public getVehicleList() : IVehicle[] {
        return Object.assign( {}, this.vehicleList);
    }

    public getSearchMap() : Map<string, ISearchAttempt>{

        if(!this.searchMap) {
            this.searchMap = new Map<string, ISearchAttempt>();            
        }

        // create a copy of state to return to keep it immutable
        return Object.assign({}, this.searchMap);
    }

    public setSearchAttempt(widgetId : string, searchAttempt : ISearchAttempt) {

        const clonedSearchAttempt : ISearchAttempt = Object.assign({}, searchAttempt);

        this.searchMap.set(widgetId, clonedSearchAttempt);
    }

    public getUnsearchedPlanetList() : IPlanet[] {

        const planetList : IPlanet[] = [];
        const searchAttempts = this.searchMap.values();

        for(let planet of this.allPlanetList){

            if(!this.findPlanetInMap(searchAttempts, planet)) {
                planetList.push(planet);
            }            
        }

        return planetList;
    }

    private findPlanetInMap(searchAttemps : IterableIterator<ISearchAttempt>, planet : IPlanet) : boolean{

        for(let searchAttempt of searchAttemps) {
            if( planet.name === searchAttempt.searchedPlanet.name) {
                return true;
            }
        }
        return false;
    }
}