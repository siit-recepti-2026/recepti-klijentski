import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

//Svakom zahtevu ka nasem serveru dodaje JWT u zaglavlje Authorization.
//Ako server odgovori sa 401 (token vise ne vazi), korisnik se odjavljuje i salje na prijavu.
export const authInterceptor: HttpInterceptorFn = (zahtev, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const kaServeru = zahtev.url.startsWith(environment.apiUrl);
  const kaAuth = zahtev.url.startsWith(`${environment.apiUrl}/auth/`);
  const token = kaServeru && !kaAuth ? authService.token() : null;

  const saTokenom = token
    ? zahtev.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : zahtev;

  return next(saTokenom).pipe(
    catchError((greska: HttpErrorResponse) => {
      if (greska.status === 401 && token) {
        authService.odjavi();
        router.navigate(['/auth/prijava'], { queryParams: { povratak: router.url } });
      }
      return throwError(() => greska);
    }),
  );
};
