import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { TypeaheadComponent } from './typeahead.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { IPlanet } from '../../models/planet';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, Type } from '@angular/core';

describe('TypeAhead Component', () => {
  let fixture: ComponentFixture<TypeaheadComponent>;
  let component: TypeaheadComponent;
  let planets: IPlanet[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeaheadComponent],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(TypeaheadComponent);
    component = fixture.componentInstance;

    planets = [
      { name: 'Donlon', distance: 100 },
      { name: 'Enchai', distance: 200 },
      { name: 'Jebing', distance: 300 },
      { name: 'Sapir', distance: 400 },
    ];
  });

  it('is created', () => {
    component.sourceArray = [];
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    expect(fixture.debugElement.componentInstance).toBeTruthy();
  });

  it('renders typeahaed input text box', () => {
    component.sourceArray = [];
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('input.typeAhead[type=text]'))
    ).toBeTruthy();
  });

  it('shows result list if input text box recieves focus', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);

    fixture.detectChanges();

    const resultListUlDebugElement = fixture.debugElement.query(
      By.css('div.resultList ul')
    );

    expect(resultListUlDebugElement).toBeTruthy();
    (expect(fixture) as any).toMatchSnapshot();
  });

  it('hides result list if typeahead loses focus', fakeAsync(() => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);

    fixture.detectChanges();

    let resultListUlDebugElement = fixture.debugElement.query(
      By.css('div.resultList ul')
    );

    expect(resultListUlDebugElement).toBeTruthy();

    const typeAheadContainerDebugElement = fixture.debugElement.query(
      By.css('div.typeahead-container')
    );
    expect(typeAheadContainerDebugElement).toBeTruthy();

    typeAheadContainerDebugElement.triggerEventHandler('focusout', null);
    // typeAheadContainerDebugElement.nativeElement.dispatchEvent(
    //   new Event('focusout')
    // );

    fixture.detectChanges();

    flush();

    resultListUlDebugElement = fixture.debugElement.query(
      By.css('div.resultList ul')
    );

    expect(resultListUlDebugElement).toBeFalsy();
  }));

  it('result list has expected values', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);

    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );
    expect(resultListLiElements).toBeTruthy();
    expect(resultListLiElements.length).toBe(planets.length + 1);

    resultListLiElements.forEach((li, index) => {
      if (index > 0) {
        expect((li as HTMLElement).textContent).toContain(
          planets[index - 1].name
        );
      } else {
        expect((resultListLiElements[0] as HTMLElement).textContent).toContain(
          'None'
        );
      }
    });
  });

  it('filters based on input text', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );
    inputElement.dispatchEvent(new Event('focus'));
    inputElement.value = 'Don';
    inputElement.dispatchEvent(new Event('input'));

    // could have also triggered this via debugelement triggerEvenHandler like this
    /* const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
      );
      inputDebugElement.triggerEventHandler('input', {target : inputDebugElement.nativeElement}); */
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    expect(resultListLiElements).toBeTruthy();
    expect(resultListLiElements.length).toEqual(2);

    expect(resultListLiElements[0].textContent).toContain('None');
    expect(resultListLiElements[1].textContent).toContain('Donlon');
  });

  it(`sets previously selected planet in text box
    if user discards his search results by clicking out`, fakeAsync(() => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    const spy = jest.spyOn(component.itemSelected, 'emit');
    resultListLiElements[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(planets[0]);

    inputDebugElement.nativeElement.value = 'i';
    inputDebugElement.triggerEventHandler('input', {
      target: inputDebugElement.nativeElement,
    });
    fixture.detectChanges();

    const typeAheadContainerDebugElement = fixture.debugElement.query(
      By.css('div.typeahead-container')
    );
    expect(typeAheadContainerDebugElement).toBeTruthy();

    typeAheadContainerDebugElement.triggerEventHandler('focusout', null);

    flush();
    fixture.detectChanges();

    expect(inputDebugElement.nativeElement.value).toBe(planets[0].name);
  }));

  it('filters even for partial planet name in input text', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    inputDebugElement.nativeElement.value = 'i';
    inputDebugElement.triggerEventHandler('input', {
      target: inputDebugElement.nativeElement,
    });
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    expect(resultListLiElements).toBeTruthy();
    expect(resultListLiElements.length).toEqual(4);
  });

  it('No planets are shown in result list if no match is found', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    inputDebugElement.nativeElement.value = 'flabbegaster';
    inputDebugElement.triggerEventHandler('input', {
      target: inputDebugElement.nativeElement,
    });
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    expect(resultListLiElements).toBeTruthy();
    expect(resultListLiElements.length).toEqual(1);
    expect(resultListLiElements[0].textContent).toContain('None');
  });

  it('shows all planets in result list when input text has whitespace', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    inputDebugElement.nativeElement.value = '   ';
    inputDebugElement.triggerEventHandler('input', {
      target: inputDebugElement.nativeElement,
    });
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    expect(resultListLiElements).toBeTruthy();
    expect(resultListLiElements.length).toEqual(5);
  });

  it('emits selected planet when result item is clicked', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    const spy = jest.spyOn(component.itemSelected, 'emit');
    resultListLiElements[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(planets[0]);
    // this gives the value emitted by the itemSelected event emitter
    // console.log(spy.mock.calls[0][0]);
  });

  it('emits dummy planet when result item "None" is clicked', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    const spy = jest.spyOn(component.itemSelected, 'emit');
    resultListLiElements[0].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ name: 'Select', distance: 0 });
  });

  it(`should display all available planets in result list
  after previous planet is unselected by clicking on item "None"
  and user clicks again in the typeahead`, () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of();

    fixture.detectChanges();

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    let resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    // simulate selection of '2nd item Donlon' in result list
    resultListLiElements[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // set focus in textbox to show the list
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    // get result list
    resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    // simulate selection of 'None' in result list
    resultListLiElements[0].dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // set focus on input box to show the result list again
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    expect(component.filteredSourceArray).toBe(component.sourceArray);

    expect(resultListLiElements.length).toBe(component.sourceArray.length + 1);
  });

  it('when reset observable fires, the typeadhead is reset', fakeAsync(() => {
    component.sourceArray = planets;
    const resetSubject = new Subject<void>();
    component.resetTypeAhead$ = resetSubject.asObservable();

    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input.typeAhead[type=text]'
    );

    const inputDebugElement = fixture.debugElement.query(
      By.css('input.typeAhead[type=text]')
    );
    inputDebugElement.triggerEventHandler('focus', null);
    fixture.detectChanges();

    const resultListLiElements = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'div.resultList ul li'
    );

    const spy = jest.spyOn(component.itemSelected, 'emit');
    resultListLiElements[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(planets[0]);
    expect(component.filteredSourceArray.length).toBe(1);

    resetSubject.next();
    flush();
    fixture.detectChanges();
    expect(component.inputTextControl.value).toBe('');
    expect(component.filteredSourceArray).toBe(planets);
  }));
});
