import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
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
    return this.http.post<PrijavaOdgovor>(`${this.url}/prijava`, zahtev).pipe(
      tap((odgovor) => {
        const sesija: Sesija = {
          token: odgovor.token,
          istice: odgovor.istice,
          korisnickoIme: odgovor.korisnickoIme,
          uloga: odgovor.uloga,
        };
        localStorage.setItem(KLJUC_SESIJE, JSON.stringify(sesija));
        this.sesija.set(sesija);
      }),
    );
  }

  odjavi(): void {
    localStorage.removeItem(KLJUC_SESIJE);
    this.sesija.set(null);
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
