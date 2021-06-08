import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.getCurrentAuthState()) {
      return true;
    } else {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}}).then();
      return;
    }
  }

   constructor(private authService: AuthService,
    private router: Router){
   }



}
