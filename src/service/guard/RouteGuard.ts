import {Injectable} from "@angular/core";
import {CanActivate, CanActivateChild, Router} from "@angular/router";

@Injectable()
export class RouteGuard implements CanActivate,CanActivateChild {
  constructor(private router: Router) {
  }

  canActivateChild(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
