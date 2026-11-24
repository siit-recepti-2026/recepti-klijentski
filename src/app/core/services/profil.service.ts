import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfilOdgovor } from '../models/profil.models';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/profili`;

  pregled(korisnickoIme: string): Observable<ProfilOdgovor> {
    return this.http.get<ProfilOdgovor>(`${this.url}/${encodeURIComponent(korisnickoIme)}`);
  }
}
