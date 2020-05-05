import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypeaheadComponent } from './typeahead.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IPlanet } from '../../models/planet';

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
});
