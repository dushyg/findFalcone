import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { FinderBoardShellComponent } from './features/falcon-finder/containers/finder-board-shell/finder-board-shell.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'findingFalcone'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('findingFalcone');
  });

  it('should contain app-finder-board-shell component', fakeAsync(() => {
    const fixture : ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const appComponentDebugElement = fixture.debugElement;            
    expect(appComponentDebugElement.query(By.directive(RouterOutlet))).toBeTruthy();        
  }));
});