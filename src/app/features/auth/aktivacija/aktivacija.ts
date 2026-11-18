import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GreskaOdgovor } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/services/auth.service';

type Stanje = 'aktiviranje' | 'aktiviran' | 'greska';

//Stranica na koju vodi link iz aktivacionog mejla: /auth/aktivacija?token=...
@Component({
  selector: 'app-aktivacija',
  standalone: false,
  templateUrl: './aktivacija.html',
  styleUrl: './aktivacija.scss',
})
export class Aktivacija implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  protected readonly stanje = signal<Stanje>('aktiviranje');
  protected readonly poruka = signal('');
  protected readonly porukaSlanja = signal<string | null>(null);
  protected readonly salje = signal(false);
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.stanje.set('greska');
      this.poruka.set('Link za aktivaciju nije ispravan.');
      return;
    }
    this.authService.aktiviraj(token).subscribe({
      next: () => this.stanje.set('aktiviran'),
      error: (greska: HttpErrorResponse) => {
        this.stanje.set('greska');
        this.poruka.set(
          (greska.error as Partial<GreskaOdgovor> | null)?.poruka ??
            'Aktivacija nije uspela. Pokušajte ponovo kasnije.',
        );
      },
    });
  }

  protected posaljiPonovo(): void {
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.salje.set(true);
    this.authService.ponovoPosaljiAktivaciju(this.email.value.trim()).subscribe({
      next: (odgovor) => {
        this.salje.set(false);
        this.porukaSlanja.set(odgovor.poruka);
      },
      error: () => {
        this.salje.set(false);
        this.porukaSlanja.set('Slanje nije uspelo. Pokušajte ponovo kasnije.');
      },
    });
  }
}
