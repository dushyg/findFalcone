import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IPlanet } from 'src/app/core/models/planet';
import { FormControl } from '@angular/forms';

@Component({
    selector : 'app-typeahead',
    template : './typeahead.component.html',
    styleUrls : ['./typeahead.component.css']
})
export class Typeahead implements OnInit {
    
    @Input() sourceArray : IPlanet[];
    @Output() itemSelected = new EventEmitter<IPlanet>(); 

    public filteredSourceArray : IPlanet[];
    public inputTextControl =  new FormControl('');
    public doShowResults = false;
    private selectionMade = false;

    ngOnInit(): void {

        this.filteredSourceArray = this.sourceArray;

        this.inputTextControl.valueChanges.subscribe( value => {
            
            if(this.selectionMade) {
                return;
            }

            let trimmedValue = value.trim();
            if(!trimmedValue) {
                return this.sourceArray;
            }            

            this.filteredSourceArray = this.sourceArray.filter( item => {
                return item.name.includes(trimmedValue);
            });

            this.doShowResults = true;
        });
    }

    public planetSelectHandler(planetName){
        this.doShowResults = false;
        const selectedPlanet = this.filteredSourceArray.find(planet => {
            return planet.name === planetName;
        });

        this.itemSelected.emit(selectedPlanet);
        this.selectionMade = true;
        this.inputTextControl.setValue(planetName);
    }

    showInitialList() {

        this.selectionMade = false;
        this.doShowResults = true;
    }

}