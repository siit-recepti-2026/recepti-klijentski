//Oblici podataka koje server vraca i prima za profil (isti kao DTO klase na serveru)
import { LokacijaZahtev } from './auth.models';

export interface LokacijaOdgovor {
  drzava: string;
  region: string | null;
  grad: string | null;
}

//profilnaSlika je putanja na serveru (/slike/ime.jpg) ili null ako slika nije postavljena
export interface ProfilOdgovor {
  korisnickoIme: string;
  profilnaSlika: string | null;
  region: LokacijaOdgovor;
  biografija: string | null;
  brojObjavljenihRecepata: number;
}

//Korisnicko ime nije deo zahteva, jer ne moze da se menja.
//profilnaSlikaId: id slike otpremljene preko POST /api/slike; izostavljen znaci da slika ostaje ista.
export interface IzmenaProfilaZahtev {
  biografija: string | null;
  region: LokacijaZahtev;
  profilnaSlikaId?: number;
  ukloniProfilnuSliku?: boolean;
}

export interface SlikaOdgovor {
  id: number;
  url: string;
}
