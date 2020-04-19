import { Component, OnInit, OnDestroy } from "@angular/core";
import { FinderFacadeService } from "src/app/finder-board/services/finder-facade.service";
import { Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";
import { IFindFalconeRequest } from "src/app/finder-result/models/findFalconeRequest";
import { IFindFalconeResponse } from "src/app/finder-result/models/findFalconeResponse";
import { FalconFinderService } from "src/app/finder-result/services/falcon-finder.service";
import { ISearchAttempt } from "src/app/finder-board/models/searchAttempt";

@Component({
  selector: "app-falcone-result",
  templateUrl: "./falcone-result.component.html",
  styleUrls: ["./falcone-result.component.scss"],
})
export class FalconeResultComponent implements OnInit, OnDestroy {
  constructor(
    private finderService: FalconFinderService,
    private finderFacadeService: FinderFacadeService
  ) {}

  public error$: Observable<string>;
  public timeTaken$: Observable<number>;
  public planetNameFalconFoundOn: string = "";
  private isComponentActive: boolean = true;
  public errorMsg: string;
  public timeTaken: number = 0;
  public isLoading: boolean;
  private searchAttemptMap: Map<string, ISearchAttempt>;

  ngOnInit() {
    this.finderFacadeService.dashboardVm$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((vm) => {
        this.errorMsg = vm.error;
        this.timeTaken = vm.totalTimeTaken;
        this.isLoading = vm.isLoading;
        this.searchAttemptMap = vm.searchAttemptMap;
      });

    this.findFalcon();
  }

  public findFalcon(): void {
    let findFalconRequest: IFindFalconeRequest;
    const searchAttemptMap = this.searchAttemptMap;
    const maxSearchAttemptsAllowed = this.finderFacadeService.getCountOfWidgetsDisplayed();

    if (searchAttemptMap) {
      const request = <IFindFalconeRequest>{
        planet_names: new Array<string>(maxSearchAttemptsAllowed),
        vehicle_names: new Array<string>(maxSearchAttemptsAllowed),
      };

      let index = 0;
      for (let searchAttemptEntry of searchAttemptMap) {
        const searchAttempt = searchAttemptEntry[1];

        request.planet_names[index] = searchAttempt.searchedPlanet;
        request.vehicle_names[index] = searchAttempt.vehicleUsed;

        index++;
      }

      findFalconRequest = request;
    } else {
      findFalconRequest = null;
    }

    if (findFalconRequest) {
      this.callFindFalconApi(findFalconRequest);
    }
  }

  private callFindFalconApi(request: IFindFalconeRequest) {
    request.token = this.finderFacadeService.getFinderApiToken();
    this.finderFacadeService.setLoadingFlag(true);
    this.finderService.findFalcon(request).subscribe(
      (response: IFindFalconeResponse) => {
        this.finderFacadeService.setLoadingFlag(false);

        let errorMsg = null;
        if (response) {
          if (response.error) {
            errorMsg = response.error;
            this.finderFacadeService.updateError(errorMsg);
          } else if (response.status) {
            if (response.status.trim().toLowerCase() === "success") {
              if (response.planetName) {
                this.planetNameFalconFoundOn = response.planetName;
              } else {
                errorMsg = "Search api returned empty planet name";
                this.finderFacadeService.updateError(errorMsg);
              }
            } else if (response.status.trim().toLocaleLowerCase() === "false") {
              errorMsg =
                "Failure! You were unable to find Falcone. Better luck next time.";
              this.finderFacadeService.updateError(errorMsg);
            } else {
              errorMsg = "Search api did not return a response status value.";
              this.finderFacadeService.updateError(errorMsg);
            }
          }
        } else {
          errorMsg = "Search api returned invalid response.";
          this.finderFacadeService.updateError(errorMsg);
        }
      },
      (error) => {
        this.finderFacadeService.setLoadingFlag(false);
        this.finderFacadeService.updateError(error);
      }
    );
  }

  reset() {
    this.finderFacadeService.resetApp();
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
