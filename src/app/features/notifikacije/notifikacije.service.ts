import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface SistemskaNotifikacija {
  id: number;
  naslov: string;
  poruka: string;
  vremeKreiranja: string;
}

@Injectable({ providedIn: 'root' })
export class NotifikacijeService {
  private readonly http = inject(HttpClient);

  moje() {
    return this.http.get<SistemskaNotifikacija[]>(`${environment.apiUrl}/notifikacije`);
  }
}
