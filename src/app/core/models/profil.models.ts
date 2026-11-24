//Oblici podataka koje server vraca za profil (isti kao DTO klase na serveru)

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
