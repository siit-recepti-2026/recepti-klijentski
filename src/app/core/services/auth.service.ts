import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DostupnostOdgovor,
  PorukaOdgovor,
  PrijavaOdgovor,
  PrijavaZahtev,
  RegistracijaZahtev,
  Sesija,
} from '../models/auth.models';

const KLJUC_SESIJE = 'recepti.sesija';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  //Sesija se cita iz localStorage, pa korisnik ostaje prijavljen i posle zatvaranja pregledaca
  private readonly sesija = signal<Sesija | null>(this.ucitajSesiju());

  readonly prijavljen = computed(() => this.sesija() !== null);
  readonly korisnickoIme = computed(() => this.sesija()?.korisnickoIme ?? null);
  readonly jeAdministrator = computed(() => this.sesija()?.uloga === 'ADMINISTRATOR');

  registruj(zahtev: RegistracijaZahtev): Observable<PorukaOdgovor> {
    return this.http.post<PorukaOdgovor>(`${this.url}/registracija`, zahtev);
  }

  dostupnoKorisnickoIme(vrednost: string): Observable<boolean> {
    return this.http
      .get<DostupnostOdgovor>(`${this.url}/dostupnost/korisnicko-ime`, { params: { vrednost } })
      .pipe(map((odgovor) => odgovor.dostupno));
  }

  dostupanEmail(vrednost: string): Observable<boolean> {
    return this.http
      .get<DostupnostOdgovor>(`${this.url}/dostupnost/email`, { params: { vrednost } })
      .pipe(map((odgovor) => odgovor.dostupno));
  }

  aktiviraj(token: string): Observable<PorukaOdgovor> {
    return this.http.post<PorukaOdgovor>(`${this.url}/aktivacija`, { token });
  }

  ponovoPosaljiAktivaciju(email: string): Observable<PorukaOdgovor> {
    return this.http.post<PorukaOdgovor>(`${this.url}/aktivacija/ponovo`, { email });
  }

  prijavi(zahtev: PrijavaZahtev): Observable<PrijavaOdgovor> {
    return this.http
      .post<PrijavaOdgovor>(`${this.url}/prijava`, zahtev)
      .pipe(tap((odgovor) => this.sacuvajSesiju(odgovor)));
  }

  //Pri svakom otvaranju aplikacije vazeci token se menja novim, sa punim trajanjem, pa korisnik
  //koji koristi aplikaciju ostaje prijavljen dok se sam ne odjavi. Ako token vise ne vazi (401),
  //interceptor odjavljuje korisnika; ako server nije dostupan, sesija ostaje kakva je bila.
  osveziSesiju(): void {
    if (!this.token()) {
      return;
    }
    this.http
      .post<PrijavaOdgovor>(`${environment.apiUrl}/sesija/osvezi`, null)
      .pipe(catchError(() => EMPTY))
      .subscribe((odgovor) => this.sacuvajSesiju(odgovor));
  }

  odjavi(): void {
    localStorage.removeItem(KLJUC_SESIJE);
    this.sesija.set(null);
  }

  private sacuvajSesiju(odgovor: PrijavaOdgovor): void {
    const sesija: Sesija = {
      token: odgovor.token,
      istice: odgovor.istice,
      korisnickoIme: odgovor.korisnickoIme,
      uloga: odgovor.uloga,
    };
    localStorage.setItem(KLJUC_SESIJE, JSON.stringify(sesija));
    this.sesija.set(sesija);
  }

  //Token koji interceptor dodaje zahtevima; istekao token se ne salje i sesija se brise
  token(): string | null {
    const sesija = this.sesija();
    if (sesija && this.istekla(sesija)) {
      this.odjavi();
      return null;
    }
    return sesija?.token ?? null;
  }

  private ucitajSesiju(): Sesija | null {
    try {
      const sacuvana = localStorage.getItem(KLJUC_SESIJE);
      const sesija = sacuvana ? (JSON.parse(sacuvana) as Sesija) : null;
      if (sesija && !this.istekla(sesija)) {
        return sesija;
      }
      localStorage.removeItem(KLJUC_SESIJE);
    } catch {
      //Ostecen zapis u localStorage, korisnik se jednostavno ponovo prijavljuje
    }
    return null;
  }

  private istekla(sesija: Sesija): boolean {
    return new Date(sesija.istice).getTime() <= Date.now();
  }
}
