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

@Injectable({ providedIn: 'root' })
export class AdminPregledService {
  private readonly http = inject(HttpClient);

  pregled() {
    return this.http.get<AdminPregled>(`${environment.apiUrl}/admin/pregled`);
  }
}
