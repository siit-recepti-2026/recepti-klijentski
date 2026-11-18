import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DostupnostOdgovor, PorukaOdgovor, RegistracijaZahtev } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

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
}
