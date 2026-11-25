import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ProfilOdgovor } from '../../core/models/profil.models';
import { AuthService } from '../../core/services/auth.service';
import { ProfilService } from '../../core/services/profil.service';
import { ADRESA_SERVERA } from '../../core/services/slika.service';

type Stanje = 'ucitavanje' | 'prikaz' | 'ne-postoji' | 'greska';

//Pregled svog i tudjeg profila; korisnicko ime je u adresi (/profil/pera)
@Component({
  selector: 'app-profil',
  standalone: false,
  styleUrl: './profil.scss',
  templateUrl: './profil.html',
})
export class Profil {
  private readonly route = inject(ActivatedRoute);
  private readonly profilService = inject(ProfilService);
  private readonly authService = inject(AuthService);

  protected readonly stanje = signal<Stanje>('ucitavanje');
  protected readonly profil = signal<ProfilOdgovor | null>(null);
  protected readonly slikaNijeUcitana = signal(false);
  //Na svom profilu umesto prikaza moze da se otvori forma za izmenu
  protected readonly izmena = signal(false);

  protected readonly mojProfil = computed(
    () =>
      this.profil()?.korisnickoIme.toLowerCase() ===
      this.authService.korisnickoIme()?.toLowerCase(),
  );

  protected readonly slika = computed(() => {
    const putanja = this.profil()?.profilnaSlika;
    return putanja && !this.slikaNijeUcitana() ? ADRESA_SERVERA + putanja : null;
  });

  protected readonly inicijal = computed(
    () => this.profil()?.korisnickoIme.charAt(0).toUpperCase() ?? '',
  );

  //"Novi Sad, Vojvodina, Srbija"; region i grad nisu obavezni
  protected readonly region = computed(() => {
    const r = this.profil()?.region;
    return r ? [r.grad, r.region, r.drzava].filter(Boolean).join(', ') : '';
  });

  constructor() {
    //switchMap: prelazak sa jednog profila na drugi otkazuje prethodni zahtev
    this.route.paramMap
      .pipe(
        map((parametri) => parametri.get('korisnickoIme') ?? ''),
        tap(() => {
          this.stanje.set('ucitavanje');
          this.slikaNijeUcitana.set(false);
          this.izmena.set(false);
        }),
        switchMap((korisnickoIme) =>
          this.profilService.pregled(korisnickoIme).pipe(
            map((profil) => ({ profil, status: 200 })),
            catchError((greska: HttpErrorResponse) => of({ profil: null, status: greska.status })),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(({ profil, status }) => {
        this.profil.set(profil);
        if (profil) {
          this.stanje.set('prikaz');
        } else {
          this.stanje.set(status === 404 ? 'ne-postoji' : 'greska');
        }
      });
  }

  //Server vraca izmenjen profil, pa nema potrebe za novim ucitavanjem
  protected sacuvano(profil: ProfilOdgovor): void {
    this.profil.set(profil);
    this.slikaNijeUcitana.set(false);
    this.izmena.set(false);
  }
}
