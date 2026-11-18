import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//Stranice za prijavljene korisnike; neprijavljen ide na prijavu i posle se vraca na trazenu stranicu
export const prijavljenGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.prijavljen()
    ? true
    : router.createUrlTree(['/auth/prijava'], { queryParams: { povratak: state.url } });
};

//Administratorski deo: samo uloga ADMINISTRATOR
export const administratorGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.prijavljen()) {
    return router.createUrlTree(['/auth/prijava'], { queryParams: { povratak: state.url } });
  }
  return authService.jeAdministrator() ? true : router.createUrlTree(['/pocetna']);
};

//Prijava i registracija nemaju smisla za vec prijavljenog korisnika
export const gostGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //Aktivacija mora da radi i ako je neko drugi trenutno prijavljen u ovom pregledacu
  if (route.routeConfig?.path === 'aktivacija') {
    return true;
  }
  return authService.prijavljen() ? router.createUrlTree(['/pocetna']) : true;
};
