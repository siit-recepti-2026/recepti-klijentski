import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GreskaOdgovor } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-prijava',
  standalone: false,
  templateUrl: './prijava.html',
  styleUrl: './prijava.scss',
})
export class Prijava {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly salje = signal(false);
  protected readonly greska = signal<string | null>(null);
  protected readonly prikaziLozinku = signal(false);

  protected readonly forma = this.fb.nonNullable.group({
    korisnickoImeIliEmail: ['', Validators.required],
    lozinka: ['', Validators.required],
  });

  protected posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    const { korisnickoImeIliEmail, lozinka } = this.forma.getRawValue();
    this.salje.set(true);
    this.greska.set(null);
    this.authService
      .prijavi({ korisnickoImeIliEmail: korisnickoImeIliEmail.trim(), lozinka })
      .subscribe({
        next: () => {
          //Posle prijave korisnik se vraca na stranicu sa koje je poslat na prijavu
          const povratak = this.route.snapshot.queryParamMap.get('povratak');
          this.router.navigateByUrl(povratak?.startsWith('/') ? povratak : '/pocetna');
        },
        error: (greska: HttpErrorResponse) => {
          this.salje.set(false);
          this.greska.set(
            greska.status === 0
              ? 'Server nije dostupan. Pokušajte ponovo kasnije.'
              : ((greska.error as Partial<GreskaOdgovor> | null)?.poruka ?? 'Prijava nije uspela.'),
          );
        },
      });
  }
}
