//Oblici podataka koje server prima i vraca za /api/auth (isti kao DTO klase na serveru)

export interface LokacijaZahtev {
  drzava: string;
  region?: string;
  grad?: string;
  geografskaSirina: number;
  geografskaDuzina: number;
}

export interface RegistracijaZahtev {
  korisnickoIme: string;
  email: string;
  lozinka: string;
  region: LokacijaZahtev;
}

export interface PorukaOdgovor {
  poruka: string;
}

export interface DostupnostOdgovor {
  dostupno: boolean;
}

//Greska sa servera: poruka i, kad postoje, greske po poljima forme
export interface GreskaOdgovor {
  status: number;
  poruka: string;
  greske: Record<string, string>;
}

export interface PrijavaZahtev {
  korisnickoImeIliEmail: string;
  lozinka: string;
}

export type Uloga = 'KORISNIK' | 'ADMINISTRATOR';

export interface PrijavaOdgovor {
  token: string;
  istice: string;
  korisnickoIme: string;
  uloga: Uloga;
}

//Podaci o prijavljenom korisniku koji se cuvaju u localStorage
export interface Sesija {
  token: string;
  istice: string;
  korisnickoIme: string;
  uloga: Uloga;
}
