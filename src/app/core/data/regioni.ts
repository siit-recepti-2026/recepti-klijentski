import { LokacijaZahtev } from '../models/auth.models';

export interface Region {
  id: string;
  naziv: string;
  lokacija: LokacijaZahtev;
}

export interface GrupaRegiona {
  drzava: string;
  regioni: Region[];
}

function region(id: string, drzava: string, naziv: string, sirina: number, duzina: number): Region {
  return {
    id,
    naziv,
    lokacija: { drzava, region: naziv, geografskaSirina: sirina, geografskaDuzina: duzina },
  };
}

function drzava(id: string, naziv: string, sirina: number, duzina: number): Region {
  return {
    id,
    naziv,
    lokacija: { drzava: naziv, geografskaSirina: sirina, geografskaDuzina: duzina },
  };
}

//Regioni koje korisnik bira pri registraciji. Koordinate su potrebne za prikaz recepata na mapi.
export const GRUPE_REGIONA: GrupaRegiona[] = [
  {
    drzava: 'Srbija',
    regioni: [
      region('rs-vo', 'Srbija', 'Vojvodina', 45.2671, 19.8335),
      region('rs-bg', 'Srbija', 'Beograd', 44.8125, 20.4612),
      region('rs-sz', 'Srbija', 'Šumadija i Zapadna Srbija', 44.0128, 20.9114),
      region('rs-ji', 'Srbija', 'Južna i Istočna Srbija', 43.3209, 21.8958),
      region('rs-km', 'Srbija', 'Kosovo i Metohija', 42.6629, 21.1655),
    ],
  },
  {
    drzava: 'Region',
    regioni: [
      drzava('ba', 'Bosna i Hercegovina', 43.8563, 18.4131),
      drzava('me', 'Crna Gora', 42.4304, 19.2594),
      drzava('hr', 'Hrvatska', 45.815, 15.9819),
      drzava('mk', 'Severna Makedonija', 41.9981, 21.4254),
      drzava('si', 'Slovenija', 46.0569, 14.5058),
      drzava('hu', 'Mađarska', 47.4979, 19.0402),
      drzava('ro', 'Rumunija', 44.4268, 26.1025),
      drzava('bg', 'Bugarska', 42.6977, 23.3219),
      drzava('gr', 'Grčka', 37.9838, 23.7275),
    ],
  },
  {
    drzava: 'Ostatak sveta',
    regioni: [
      drzava('at', 'Austrija', 48.2082, 16.3738),
      drzava('de', 'Nemačka', 52.52, 13.405),
      drzava('it', 'Italija', 41.9028, 12.4964),
      drzava('fr', 'Francuska', 48.8566, 2.3522),
      drzava('es', 'Španija', 40.4168, -3.7038),
      drzava('gb', 'Ujedinjeno Kraljevstvo', 51.5074, -0.1278),
      drzava('us', 'SAD', 38.9072, -77.0369),
    ],
  },
];
