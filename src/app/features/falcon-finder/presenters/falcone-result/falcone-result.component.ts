import { Component, OnInit, OnDestroy } from "@angular/core";
import { FinderFacadeService } from "src/app/core/finder-facade.service";
import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";

@Component({
  selector: "app-falcone-result",
  templateUrl: "./falcone-result.component.html",
  styleUrls: ["./falcone-result.component.css"],
})
export class FalconeResultComponent implements OnInit, OnDestroy {
  constructor(private finderFacadeService: FinderFacadeService) {}

  public error$: Observable<string>;
  public timeTaken$: Observable<number>;
  public planetNameFalconFoundOn: string = "";
  private isComponentActive: boolean = true;
  public errorMsg: string;
  public timeTaken: number = 0;
  public isLoading: boolean;

  ngOnInit() {
    this.finderFacadeService.dashboardVm$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((vm) => {
        this.errorMsg = vm.error;
        this.timeTaken = vm.totalTimeTaken;
        this.isLoading = vm.isLoading;
      });

    this.finderFacadeService.planetFoundOn$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((planetName) => (this.planetNameFalconFoundOn = planetName));

    this.finderFacadeService.findFalcon();
  }

  reset() {
    this.finderFacadeService.resetApp();
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
