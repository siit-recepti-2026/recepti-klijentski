import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs';

import { AdminPregledService, StavkaPregleda, VrstaListe } from './admin-pregled.service';

@Component({
  selector: 'app-admin-forma-stavke',
  standalone: false,
  templateUrl: './admin-forma-stavke.html',
  styles: [
    '.forma { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.75rem; margin-top: 1rem; }',
    'mat-form-field { width: min(100%, 24rem); }',
  ],
})
export class AdminFormaStavke {
  private readonly service = inject(AdminPregledService);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('nazivPolje') private nazivPolje?: ElementRef<HTMLInputElement>;

  readonly vrsta = input.required<VrstaListe>();
  readonly sacuvano = output<StavkaPregleda>();

  protected readonly izabranaStavka = signal<StavkaPregleda | null>(null);
  protected readonly naziv = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
  });
  protected readonly cuvanje = signal(false);
  protected readonly poruka = signal('');
  protected readonly greska = signal('');

  izaberiZaIzmenu(stavka: StavkaPregleda): void {
    if (this.cuvanje()) {
      return;
    }

    this.izabranaStavka.set(stavka);
    this.naziv.reset(stavka.naziv);
    this.poruka.set('');
    this.greska.set('');
    this.nazivPolje?.nativeElement.focus();
  }

  protected odustani(): void {
    this.izabranaStavka.set(null);
    this.naziv.reset();
    this.poruka.set('');
    this.greska.set('');
  }

  protected sacuvaj(): void {
    if (this.naziv.invalid || this.cuvanje()) {
      return;
    }

    const stavka = this.izabranaStavka();
    const naziv = this.naziv.value.trim();
    const zahtev = stavka
      ? this.service
          .izmeni(this.vrsta(), stavka.id, naziv)
          .pipe(map((stavka) => ({ stavka, poruka: 'Izmena je sačuvana.' })))
      : this.service.dodaj(this.vrsta(), naziv).pipe(
          map(({ stavka, ponovoAktivirana }) => ({
            stavka,
            poruka: ponovoAktivirana ? 'Stavka je ponovo aktivirana.' : 'Stavka je dodata.',
          })),
        );

    this.poruka.set('');
    this.greska.set('');
    this.cuvanje.set(true);
    this.naziv.disable();
    zahtev
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.naziv.enable();
          this.cuvanje.set(false);
        }),
      )
      .subscribe({
        next: ({ stavka, poruka }) => {
          this.odustani();
          this.sacuvano.emit(stavka);
          this.poruka.set(poruka);
        },
        error: (greska: HttpErrorResponse) => {
          if (greska.status === 409) {
            this.greska.set('Ovaj naziv već postoji u listi.');
          } else if (greska.status === 401 || greska.status === 403) {
            this.greska.set('Čuvanje je dostupno prijavljenom administratoru.');
          } else if (greska.status === 404) {
            this.greska.set('Stavka više nije dostupna. Osveži stranicu.');
          } else {
            this.greska.set('Čuvanje nije uspelo. Pokušaj ponovo.');
          }
        },
      });
  }
}
