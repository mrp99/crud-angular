import { ActivatedRouteSnapshot } from "@angular/router";

class MockActivatedRouteSnapshot extends ActivatedRouteSnapshot {
  constructor(params: { [key: string]: any }) {
    super();
    this.params = params;
  }
}
