import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  AdminPregled,
  AdminPregledService,
  StavkaPregleda,
  VrstaListe,
} from './admin-pregled.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  styleUrl: './admin.scss',
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  private readonly service = inject(AdminPregledService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pregled = signal<AdminPregled | null>(null);
  protected readonly greska = signal('');
  protected readonly tabele: { kljuc: VrstaListe; naslov: string }[] = [
    { kljuc: 'tipoviJela', naslov: 'Tipovi jela' },
    { kljuc: 'tipoviObroka', naslov: 'Tipovi obroka' },
    { kljuc: 'tipoviIshrane', naslov: 'Tipovi ishrane' },
    { kljuc: 'kategorijeNamirnica', naslov: 'Kategorije namirnica' },
    { kljuc: 'alergeni', naslov: 'Alergeni' },
  ];

  ngOnInit(): void {
    this.ucitaj();
  }

  protected sacuvajUPrikaz(vrsta: VrstaListe, stavka: StavkaPregleda): void {
    this.pregled.update((pregled) => {
      if (!pregled) {
        return pregled;
      }

      const lista = pregled[vrsta];
      const stavke = lista.some((postojeca) => postojeca.id === stavka.id)
        ? lista.map((postojeca) => (postojeca.id === stavka.id ? stavka : postojeca))
        : [...lista, stavka];
      return { ...pregled, [vrsta]: stavke };
    });
  }

  protected ucitaj(): void {
    this.greska.set('');
    this.service
      .pregled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pregled) => this.pregled.set(pregled),
        error: () => this.greska.set('Pregled trenutno nije dostupan.'),
      });
  }
}
