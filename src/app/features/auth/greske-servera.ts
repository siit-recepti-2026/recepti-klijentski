import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { GreskaOdgovor } from '../../core/models/auth.models';

//Greske po poljima sa servera (400 i 409) prikazuju se ispod odgovarajucih polja forme.
//Vraca opstu poruku za prikaz iznad dugmeta.
export function primeniGreskeServera(forma: FormGroup, greska: HttpErrorResponse): string {
  if (greska.status === 0) {
    return 'Server nije dostupan. Pokušajte ponovo kasnije.';
  }
  const odgovor = greska.error as Partial<GreskaOdgovor> | null;
  const poPoljima = odgovor?.greske ?? {};
  for (const [polje, poruka] of Object.entries(poPoljima)) {
    const kontrola = forma.get(polje);
    if (kontrola) {
      kontrola.setErrors({ ...kontrola.errors, server: poruka });
      kontrola.markAsTouched();
    }
  }
  return odgovor?.poruka ?? 'Došlo je do greške. Pokušajte ponovo.';
}
