import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SlikaOdgovor } from '../models/profil.models';

//Iste granice kao na serveru, da korisnik gresku vidi pre slanja
export const DOZVOLJENI_TIPOVI_SLIKA = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_VELICINA_SLIKE = 5 * 1024 * 1024;

//Slike se sluze sa servera (npr. http://localhost:8080/slike/ime.jpg), a u bazi je samo putanja
export const ADRESA_SERVERA = environment.apiUrl.replace(/\/api$/, '');

//Zajednicko otpremanje slika (profilna slika, a kasnije recepti i komentari)
@Injectable({ providedIn: 'root' })
export class SlikaService {
  private readonly http = inject(HttpClient);

  otpremi(fajl: File): Observable<SlikaOdgovor> {
    const podaci = new FormData();
    podaci.append('fajl', fajl);
    return this.http.post<SlikaOdgovor>(`${environment.apiUrl}/slike`, podaci);
  }

  //Poruka za fajl koji server ne bi prihvatio, ili null ako je fajl u redu
  greskaZaFajl(fajl: File): string | null {
    if (!DOZVOLJENI_TIPOVI_SLIKA.includes(fajl.type)) {
      return 'Dozvoljene su samo slike u formatu jpg, png ili webp.';
    }
    if (fajl.size > MAX_VELICINA_SLIKE) {
      return 'Slika može imati najviše 5 MB.';
    }
    return null;
  }
}
