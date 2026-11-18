import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, Observable, of } from 'rxjs';
import { LOZINKA_PATTERN, dostupnost, lozinkeSePoklapaju } from './auth.validators';

describe('lozinkeSePoklapaju', () => {
  function forma(lozinka: string, potvrda: string): FormGroup {
    return new FormGroup(
      { lozinka: new FormControl(lozinka), potvrda: new FormControl(potvrda) },
      { validators: lozinkeSePoklapaju('lozinka', 'potvrda') },
    );
  }

  it('oznacava potvrdu kad se lozinke razlikuju', () => {
    expect(forma('lozinka123', 'lozinka124').get('potvrda')?.hasError('nePoklapaSe')).toBe(true);
  });

  it('ne prijavljuje gresku kad su lozinke iste', () => {
    expect(forma('lozinka123', 'lozinka123').get('potvrda')?.errors).toBeNull();
  });

  it('uklanja gresku kad korisnik ispravi lozinku', () => {
    const f = forma('lozinka123', 'lozinka124');
    f.get('lozinka')?.setValue('lozinka124');
    expect(f.get('potvrda')?.errors).toBeNull();
  });
});

describe('LOZINKA_PATTERN', () => {
  it('trazi bar jedno slovo i bar jedan broj', () => {
    expect(LOZINKA_PATTERN.test('lozinka123')).toBe(true);
    expect(LOZINKA_PATTERN.test('samoslova')).toBe(false);
    expect(LOZINKA_PATTERN.test('12345678')).toBe(false);
  });
});

describe('dostupnost', () => {
  function proveri(dostupno: boolean, vrednost: string): Promise<unknown> {
    const validator = dostupnost((): Observable<boolean> => of(dostupno));
    return firstValueFrom(validator(new FormControl(vrednost)) as Observable<unknown>);
  }

  it('vraca gresku zauzeto kad server kaze da vrednost nije slobodna', async () => {
    expect(await proveri(false, 'pera')).toEqual({ zauzeto: true });
  });

  it('ne vraca gresku kad je vrednost slobodna', async () => {
    expect(await proveri(true, 'pera')).toBeNull();
  });

  it('ne pita server za prazno polje', async () => {
    expect(await proveri(false, '')).toBeNull();
  });
});
