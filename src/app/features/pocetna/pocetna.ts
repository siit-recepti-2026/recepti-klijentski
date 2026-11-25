import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReceptKarticaOdgovor } from '../../core/models/recept.models';
import { ReceptService } from '../../core/services/recept.service';

type Prikaz = 'popularni' | 'najnoviji';

//Pocetna strana: popularni recepti (podrazumevano) ili najnoviji recepti, kao kartice
@Component({
  selector: 'app-pocetna',
  standalone: false,
  styleUrl: './pocetna.scss',
  templateUrl: './pocetna.html',
})
export class Pocetna {
  private readonly receptService = inject(ReceptService);

  protected readonly prikaz = signal<Prikaz>('popularni');
  protected readonly recepti = signal<ReceptKarticaOdgovor[]>([]);
  protected readonly ucitavanje = signal(true);
  protected readonly greska = signal(false);

  private zahtev?: Subscription;
  //Vec ucitani prikazi, pa je povratak na njih trenutan, bez novog zahteva serveru
  private readonly ucitano = new Map<Prikaz, ReceptKarticaOdgovor[]>();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.zahtev?.unsubscribe());
    this.ucitaj();
  }

  protected promeniPrikaz(prikaz: Prikaz): void {
    if (prikaz === this.prikaz()) {
      return;
    }
    this.prikaz.set(prikaz);

    const sacuvani = this.ucitano.get(prikaz);
    if (sacuvani) {
      this.zahtev?.unsubscribe();
      this.recepti.set(sacuvani);
      this.greska.set(false);
      this.ucitavanje.set(false);
    } else {
      this.ucitaj();
    }
  }

  protected ucitaj(): void {
    //Odgovor na prethodni zahtev vise nije potreban, pa ne sme da prepise novi prikaz
    this.zahtev?.unsubscribe();
    this.ucitavanje.set(true);
    this.greska.set(false);

    const odgovor =
      this.prikaz() === 'popularni'
        ? this.receptService.popularni()
        : this.receptService.najnoviji();

    this.zahtev = odgovor.subscribe({
      next: (recepti) => {
        this.ucitano.set(this.prikaz(), recepti);
        this.recepti.set(recepti);
        this.ucitavanje.set(false);
      },
      error: () => {
        this.recepti.set([]);
        this.greska.set(true);
        this.ucitavanje.set(false);
      },
    });
  }
}
