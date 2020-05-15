import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IPlanet } from 'src/app/finder-board/models';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

// tslint:disable: semicolon
@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeaheadComponent implements OnInit, OnDestroy {
  @Input() sourceArray: IPlanet[];
  @Input() resetTypeAhead$: Observable<void>;
  @Input() public widgetId: number;
  @Output() itemSelected = new EventEmitter<IPlanet>();

  public filteredSourceArray: IPlanet[];
  public inputTextControl = new FormControl('');
  public doShowResults = false;
  private lastSelection = '';
  private isComponentActive = true;
  constructor(private changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.filteredSourceArray = this.sourceArray;

    this.inputTextControl.valueChanges.subscribe(this.performSearch);

    this.resetTypeAhead$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe(() => {
        // Need to wrap call to reset in setTimeout because this subscription happens before
        // the sourceArray is updated via inputs. Without setTimeout the reset function will
        // set the filteredSourceArray to old sourceArray.
        setTimeout(() => {
          this.reset();
        }, 0);
      });
  }

  private reset() {
    this.filteredSourceArray = this.sourceArray;
    this.lastSelection = '';
    this.inputTextControl.setValue('', { emitEvent: false });
    this.changeDetector.detectChanges();
  }

  private performSearch = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    if (!trimmedValue) {
      this.filteredSourceArray = this.sourceArray;
      return;
    }

    this.filteredSourceArray = this.sourceArray.filter((item) => {
      return item.name.toLowerCase().includes(trimmedValue);
    });
  };

  public planetSelectHandler(planetName) {
    let selectedPlanet = this.filteredSourceArray.find((planet) => {
      return planet.name === planetName;
    });

    if (planetName === 'Select') {
      selectedPlanet = { name: 'Select', distance: 0 } as IPlanet;
      this.lastSelection = '';
      this.inputTextControl.setValue('');
    } else {
      this.lastSelection = selectedPlanet.name;
      this.inputTextControl.setValue(this.lastSelection);
    }

    this.itemSelected.emit(selectedPlanet);
  }

  public showResultsList() {
    this.doShowResults = true;
  }

  public hideResultsList() {
    // focusout event on the wrapper div is fired first,
    // hence we need to call this after some delay so that lastSelection field
    // has latest value
    setTimeout(this.hideResults, 200);
  }

  private hideResults = () => {
    this.doShowResults = false;
    this.changeDetector.detectChanges();
    const currentText = this.inputTextControl.value;
    if (currentText === this.lastSelection) {
      return;
    }

    this.inputTextControl.setValue(this.lastSelection);
  };

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked(): void {
    // console.log('TypeAheadComponent ngAfterViewChecked', this.widgetId);
  }
}
