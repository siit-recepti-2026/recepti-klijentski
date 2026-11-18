import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AdminPregledService, StavkaPregleda, VrstaListe } from './admin-pregled.service';

@Component({
  selector: 'app-admin-dodavanje',
  standalone: false,
  templateUrl: './admin-dodavanje.html',
  styles: [
    '.forma { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.75rem; margin-top: 1rem; }',
    'mat-form-field { width: min(100%, 24rem); }',
  ],
})
export class AdminDodavanje {
  private readonly service = inject(AdminPregledService);
  private readonly destroyRef = inject(DestroyRef);

  readonly vrsta = input.required<VrstaListe>();
  readonly dodato = output<StavkaPregleda>();

  protected readonly naziv = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
  });
  protected readonly cuvanje = signal(false);
  protected readonly poruka = signal('');
  protected readonly greska = signal('');

  protected dodaj(): void {
    if (this.naziv.invalid || this.cuvanje()) {
      return;
    }

    this.poruka.set('');
    this.greska.set('');
    this.cuvanje.set(true);
    this.naziv.disable();
    this.service
      .dodaj(this.vrsta(), this.naziv.value.trim())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.naziv.enable();
          this.cuvanje.set(false);
        }),
      )
      .subscribe({
        next: (stavka) => {
          this.naziv.reset();
          this.dodato.emit(stavka);
          this.poruka.set('Stavka je dodata.');
        },
        error: (greska: HttpErrorResponse) => {
          if (greska.status === 409) {
            this.greska.set('Ovaj naziv već postoji u listi.');
          } else if (greska.status === 401 || greska.status === 403) {
            this.greska.set('Dodavanje je dostupno prijavljenom administratoru.');
          } else {
            this.greska.set('Čuvanje nije uspelo. Pokušaj ponovo.');
          }
        },
      });
  }
}
