import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';

//Ista pravila kao na serveru (RegistracijaZahtev), da korisnik vidi gresku pre slanja
export const KORISNICKO_IME_PATTERN = /^[A-Za-z0-9._-]+$/;
export const LOZINKA_PATTERN = /^(?=.*\p{L})(?=.*\d).+$/u;

//Sinhroni validator za celu formu: lozinka i ponovljena lozinka moraju biti iste
export function lozinkeSePoklapaju(lozinka: string, potvrda: string): ValidatorFn {
  return (forma: AbstractControl): ValidationErrors | null => {
    const potvrdaKontrola = forma.get(potvrda);
    if (!potvrdaKontrola || !potvrdaKontrola.value) {
      return null;
    }
    const razlicite = forma.get(lozinka)?.value !== potvrdaKontrola.value;
    if (razlicite) {
      potvrdaKontrola.setErrors({ ...potvrdaKontrola.errors, nePoklapaSe: true });
    } else if (potvrdaKontrola.hasError('nePoklapaSe')) {
      const ostale: ValidationErrors = { ...potvrdaKontrola.errors };
      delete ostale['nePoklapaSe'];
      potvrdaKontrola.setErrors(Object.keys(ostale).length ? ostale : null);
    }
    return null;
  };
}

//Asinhroni validator: pita server da li je vrednost slobodna.
//Ceka 400 ms posle poslednjeg kucanja, da se server ne pita za svako slovo.
export function dostupnost(provera: (vrednost: string) => Observable<boolean>): AsyncValidatorFn {
  return (kontrola: AbstractControl): Observable<ValidationErrors | null> => {
    const vrednost = (kontrola.value ?? '').trim();
    if (!vrednost) {
      return of(null);
    }
    return timer(400).pipe(
      switchMap(() => provera(vrednost)),
      map((dostupno) => (dostupno ? null : { zauzeto: true })),
      //Ako server nije dostupan, forma se ne blokira; server ce svakako proveriti pri slanju
      catchError(() => of(null)),
    );
  };
}
