import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  //adding services in services
  constructor(private authService: AuthService, private route: Router){}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isUserAuthenticated.pipe(take(1),
    switchMap(isAuthenticated => {
      if(!isAuthenticated){
        return this.authService.autoLogin();
      } else {
        return of(isAuthenticated);
      }
    }),
    tap(isAuthenticated => {
      if(!isAuthenticated){
        this.route.navigateByUrl('/auth');
      }
    }));
  }

}
