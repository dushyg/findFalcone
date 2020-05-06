import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypeaheadComponent } from './typeahead.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
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
    component.resetTypeAhead$ = of(null);

    fixture.detectChanges();

    expect(fixture.debugElement.componentInstance).toBeTruthy();
  });

  it('renders typeahaed input text box', () => {
    component.sourceArray = [];
    component.resetTypeAhead$ = of(null);

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('input.typeAhead[type=text]'))
    ).toBeTruthy();
  });

  it('shows result list if input text box recieves focus', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of(null);

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
  });

  it('result list has expected values', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of(null);

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
    component.resetTypeAhead$ = of(null);

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

  it('filters even for partial planet name in input text', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of(null);

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

  it('emits selected planet when result item is clicked', () => {
    component.sourceArray = planets;
    component.resetTypeAhead$ = of(null);

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
});
