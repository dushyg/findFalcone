import { Component, OnInit, OnDestroy } from "@angular/core";
import { FinderFacadeService } from "src/app/finder-board/services/finder-facade.service";
import { Router } from "@angular/router";
import { takeWhile } from "rxjs/operators";

@Component({
  selector: "app-finder-board",
  templateUrl: "./finder-board.component.html",
  styleUrls: ["./finder-board.component.scss"],
})
export class FinderBoardComponent implements OnInit, OnDestroy {
  constructor(
    public finderFacadeService: FinderFacadeService,
    private router: Router
  ) {}

  public isLoading: boolean;
  public error: string;
  public timeTaken: number;
  public isReadyToSearch: boolean;

  private isComponentActive = true;
  public isInitialized = false;

  ngOnInit() {
    this.finderFacadeService.dashboardVm$
      .pipe(takeWhile(() => this.isComponentActive))
      .subscribe((vm) => {
        this.isInitialized = true;
        this.error = vm.error;
        this.timeTaken = vm.totalTimeTaken;
        this.isReadyToSearch = vm.isReadyForSearch;
        this.isLoading = vm.isLoading;
      });

    this.finderFacadeService.initializeAppData();
  }

  public findFalcone() {
    this.router.navigate(["result"]);
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
  }
}
