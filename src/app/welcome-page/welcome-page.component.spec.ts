import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomePageComponent } from './welcome-page.component';
import { Router } from '@angular/router';
import { createSpyObj } from '../testingUtility';
import { FinderFacadeService } from '../services';

describe('Welcome Page Component', () => {
  let fixture: ComponentFixture<WelcomePageComponent>;
  let component: WelcomePageComponent;
  let routerServiceMock: { [key: string]: jest.Mock<any, any> };
  let finderFacadeServiceMock;

  beforeEach(() => {
    routerServiceMock = createSpyObj(['navigate']);
    finderFacadeServiceMock = {
      setLoadingFlag: (loading) => {},
    };
    TestBed.configureTestingModule({
      declarations: [WelcomePageComponent],
      providers: [
        { provide: Router, useValue: routerServiceMock },
        { provide: FinderFacadeService, useValue: finderFacadeServiceMock },
      ],
    });
    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
  });

  it('Is created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    (expect(fixture) as any).toMatchSnapshot();
  });

  it('navigates to finderboard route when start button is clicked', () => {
    fixture.detectChanges();
    const loadingSpy = jest.spyOn(finderFacadeServiceMock, 'setLoadingFlag');
    const routerSpy = jest.spyOn(routerServiceMock, 'navigate');
    const btnStart: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.btnStart'
    );

    expect(btnStart).toBeTruthy();

    btnStart.click();

    expect(loadingSpy).toHaveBeenCalledWith(true);
    expect(routerSpy).toHaveBeenCalledWith(['/finderboard']);
  });
});
