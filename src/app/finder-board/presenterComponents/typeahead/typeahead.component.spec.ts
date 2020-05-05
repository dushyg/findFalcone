import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypeaheadComponent } from './typeahead.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IPlanet } from '../../models/planet';
import { By } from '@angular/platform-browser';

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

    // const resultListLiDebugElements = fixture.debugElement.queryAll(
    //   By.css('div.resultList ul li')
    // );

    // expect(resultListLiDebugElements).toBeTruthy();
    // expect(resultListLiDebugElements.length).toBe(planets.length + 1);
    // expect(
    //   (resultListLiDebugElements[0].nativeElement as HTMLElement).textContent
    // ).toContain('None');
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
});
