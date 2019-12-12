import { Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { IPlanet } from 'src/app/core/models/planet';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector : 'app-typeahead',
    templateUrl : './typeahead.component.html',
    styleUrls : ['./typeahead.component.css']
})
export class Typeahead implements OnInit, OnDestroy {
        
    @Input() sourceArray : IPlanet[];
    @Input() resetTypeAhead$ : Observable<void>;
    @Output() itemSelected = new EventEmitter<IPlanet>(); 

    public filteredSourceArray : IPlanet[];
    public inputTextControl =  new FormControl('');
    public doShowResults = false;
    private selectionMade = false;
    private lastSelection : string= "";
    private isComponentActive = true;

    ngOnInit(): void {

        this.filteredSourceArray = this.sourceArray;

        this.inputTextControl.valueChanges.subscribe(this.performSearch);

        this.resetTypeAhead$.pipe( takeWhile( () => this.isComponentActive ))
                .subscribe( () => {
                    this.reset();
                }); 
    }

    private reset() {
        this.filteredSourceArray = this.sourceArray;
        this.lastSelection = "";
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
        let selectedPlanet = this.filteredSourceArray.find(planet => {
            return planet.name === planetName;
        });

        if(planetName==='Select') {
            selectedPlanet = <IPlanet>{ name : 'Select'};
        }

        this.lastSelection = selectedPlanet.name;

        this.itemSelected.emit(selectedPlanet);
        this.selectionMade = true;
        this.inputTextControl.setValue(this.lastSelection);
       
    }

    public showResultsList() {

        this.selectionMade = false;
        this.doShowResults = true;
        this.performSearch(this.inputTextControl.value);
    }    

    public hideResultsList(){
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

    ngOnDestroy(): void {
        this.isComponentActive = false;
    }

}