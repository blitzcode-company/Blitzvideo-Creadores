import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class autenticacionGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.cookieService.check('access_token')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}