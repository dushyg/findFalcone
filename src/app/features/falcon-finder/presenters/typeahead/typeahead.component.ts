import { Component, Input, Output, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { IPlanet } from 'src/app/core/models/planet';
import { FormControl } from '@angular/forms';

@Component({
    selector : 'app-typeahead',
    templateUrl : './typeahead.component.html',
    styleUrls : ['./typeahead.component.css']
})
export class Typeahead implements OnInit {

    constructor(private renderer : Renderer2){

    }
    
    @Input() sourceArray : IPlanet[];
    @Output() itemSelected = new EventEmitter<IPlanet>(); 

    public filteredSourceArray : IPlanet[];
    public inputTextControl =  new FormControl('');
    public doShowResults = false;
    private selectionMade = false;
    private globalClickUnsubscription ;
    private lastSelection : string= "";

    ngOnInit(): void {

        this.filteredSourceArray = this.sourceArray;

        this.inputTextControl.valueChanges.subscribe(this.performSearch);

    }

    private performSearch = (value) => {
            
        if(this.selectionMade) {
            return;
        }

        let trimmedValue = value.trim().toLowerCase();
        if(!trimmedValue) {
            this.filteredSourceArray = this.sourceArray;
        }            

        this.filteredSourceArray = this.sourceArray.filter( item => {
            return item.name.toLowerCase().includes(trimmedValue);
        });

        this.doShowResults = true;
    }

    public planetSelectHandler(planetName){
        
        this.doShowResults = false;
        const selectedPlanet = this.filteredSourceArray.find(planet => {
            return planet.name === planetName;
        });
        this.lastSelection = selectedPlanet.name;

        this.itemSelected.emit(selectedPlanet);
        this.selectionMade = true;
        this.inputTextControl.setValue(this.lastSelection);
       
    }

    private showResultsList() {

        this.selectionMade = false;
        this.doShowResults = true;
        this.performSearch(this.inputTextControl.value);
    }    

    private hideResultsList(){
        // focusout event on the wrapper div is fired first, 
        // hence we need to call this after some delay so that selectionMade field 
        // has latest value 
        setTimeout(this.hideResults, 250);        
    }   

    private hideResults = () =>{
        this.doShowResults = false;

        if(this.selectionMade) {
            return;
        }

        let currentText = this.inputTextControl.value;
        if(currentText === this.lastSelection) {
            return;
        }
        this.selectionMade = true;
        this.inputTextControl.setValue(this.lastSelection);
    }
}

