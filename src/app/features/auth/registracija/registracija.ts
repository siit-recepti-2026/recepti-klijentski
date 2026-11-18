import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GRUPE_REGIONA, Region } from '../../../core/data/regioni';
import { AuthService } from '../../../core/services/auth.service';
import { primeniGreskeServera } from '../greske-servera';
import {
  KORISNICKO_IME_PATTERN,
  LOZINKA_PATTERN,
  dostupnost,
  lozinkeSePoklapaju,
} from '../validators/auth.validators';

@Component({
  selector: 'app-registracija',
  standalone: false,
  templateUrl: './registracija.html',
  styleUrl: './registracija.scss',
})
export class Registracija {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly grupeRegiona = GRUPE_REGIONA;
  protected readonly salje = signal(false);
  protected readonly greska = signal<string | null>(null);
  protected readonly uspesno = signal<string | null>(null);
  protected readonly prikaziLozinku = signal(false);
  protected readonly ponovoPoslato = signal<string | null>(null);

  protected readonly forma = this.fb.nonNullable.group(
    {
      korisnickoIme: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(KORISNICKO_IME_PATTERN),
        ],
        [dostupnost((v) => this.authService.dostupnoKorisnickoIme(v))],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
        [dostupnost((v) => this.authService.dostupanEmail(v))],
      ],
      lozinka: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(72),
          Validators.pattern(LOZINKA_PATTERN),
        ],
      ],
      potvrdaLozinke: ['', [Validators.required]],
      region: this.fb.control<Region | null>(null, Validators.required),
    },
    { validators: lozinkeSePoklapaju('lozinka', 'potvrdaLozinke') },
  );

  protected posalji(): void {
    if (this.forma.invalid || this.forma.pending) {
      this.forma.markAllAsTouched();
      return;
    }
    const { korisnickoIme, email, lozinka, region } = this.forma.getRawValue();
    this.salje.set(true);
    this.greska.set(null);
    this.authService
      .registruj({
        korisnickoIme: korisnickoIme.trim(),
        email: email.trim(),
        lozinka,
        region: region!.lokacija,
      })
      .subscribe({
        next: () => {
          this.salje.set(false);
          this.uspesno.set(email.trim());
        },
        error: (greska: HttpErrorResponse) => {
          this.salje.set(false);
          this.greska.set(primeniGreskeServera(this.forma, greska));
        },
      });
  }

  protected posaljiPonovo(email: string): void {
    this.authService.ponovoPosaljiAktivaciju(email).subscribe({
      next: (odgovor) => this.ponovoPoslato.set(odgovor.poruka),
      error: () => this.ponovoPoslato.set('Slanje nije uspelo. Pokušajte ponovo kasnije.'),
    });
  }
}
