import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StavkaPregleda {
  id: number;
  naziv: string;
  aktivan: boolean;
  opis: string | null;
  namirniceIds?: number[];
}

export interface OpcijaNamirnice {
  id: number;
  naziv: string;
}

interface PodaciAlergena {
  opis: string;
  namirniceIds: number[];
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
  alergeni: 'alergeni',
} as const;

export type VrstaListe = keyof typeof putanjeLista;

@Injectable({ providedIn: 'root' })
export class AdminPregledService {
  private readonly http = inject(HttpClient);

  pregled() {
    return this.http.get<AdminPregled>(`${environment.apiUrl}/admin/pregled`);
  }

  namirniceZaAlergene() {
    return this.http.get<OpcijaNamirnice[]>(`${environment.apiUrl}/admin/alergeni/namirnice`);
  }

  dodaj(vrsta: VrstaListe, naziv: string, podaci?: PodaciAlergena) {
    return this.http
      .post<StavkaPregleda>(`${environment.apiUrl}/admin/${putanjeLista[vrsta]}`, { naziv, ...podaci }, {
        observe: 'response',
      })
      .pipe(
        map(({ body, status }) => {
          if (!body) {
            throw new Error('Nedostaje sačuvana stavka.');
          }
          return { stavka: body, ponovoAktivirana: status === 200 };
        }),
      );
  }

  izmeni(vrsta: VrstaListe, id: number, naziv: string, podaci?: PodaciAlergena) {
    return this.http.put<StavkaPregleda>(
      `${environment.apiUrl}/admin/${putanjeLista[vrsta]}/${id}`,
      { naziv, ...podaci },
    );
  }

  deaktiviraj(vrsta: VrstaListe, id: number) {
    return this.http.delete<StavkaPregleda>(
      `${environment.apiUrl}/admin/${putanjeLista[vrsta]}/${id}`,
    );
  }
}
