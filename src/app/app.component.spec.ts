import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { By } from "@angular/platform-browser";
import { RouterOutlet } from "@angular/router";
import { Component } from "@angular/core";

describe("AppComponent", () => {
  @Component({
    selector: "app-falcon-header",
    template: "",
  })
  class FakeFalconHeaderComponent {}

  @Component({
    selector: "app-falcon-footer",
    template: "",
  })
  class FakeFalconFooterComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        FakeFalconHeaderComponent,
        FakeFalconFooterComponent,
      ],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'findingFalcone'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("findingFalcone");
  });

  it("should contain router outlet", fakeAsync(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(
      AppComponent
    );
    fixture.detectChanges();
    const appComponentDebugElement = fixture.debugElement;
    expect(
      appComponentDebugElement.query(By.directive(RouterOutlet))
    ).toBeTruthy();
  }));
});
