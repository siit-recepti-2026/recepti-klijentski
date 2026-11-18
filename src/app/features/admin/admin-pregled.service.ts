import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface StavkaPregleda {
  id: number;
  naziv: string;
  aktivan: boolean;
  opis: string | null;
}

export interface AdminPregled {
  tipoviJela: StavkaPregleda[];
  tipoviObroka: StavkaPregleda[];
  tipoviIshrane: StavkaPregleda[];
  kategorijeNamirnica: StavkaPregleda[];
  alergeni: StavkaPregleda[];
}

const putanjeLista = {
  tipoviJela: 'tipovi-jela',
  tipoviObroka: 'tipovi-obroka',
  tipoviIshrane: 'tipovi-ishrane',
  kategorijeNamirnica: 'kategorije-namirnica',
} as const;

export type VrstaListe = keyof typeof putanjeLista;

@Injectable({ providedIn: 'root' })
export class AdminPregledService {
  private readonly http = inject(HttpClient);

  pregled() {
    return this.http.get<AdminPregled>(`${environment.apiUrl}/admin/pregled`);
  }

  dodaj(vrsta: VrstaListe, naziv: string) {
    return this.http.post<StavkaPregleda>(`${environment.apiUrl}/admin/${putanjeLista[vrsta]}`, { naziv });
  }
}
